import AuthenticationServices
import CryptoKit
import Foundation
import UIKit

/// Performs the Cognito OIDC PKCE flow and refresh-token grant. Split out from
/// `AuthStore` so the store's state-management is testable without UI.
protocol OIDCClient: Sendable {
    /// Launches the hosted UI, completes the auth-code → token exchange, and
    /// returns the resulting token bundle.
    func authorize() async throws -> StoredTokens

    /// Exchanges a refresh token for a new access/id token pair.
    /// Cognito does not issue a new refresh token here, so the existing one is
    /// preserved on the returned `StoredTokens`.
    func refresh(refreshToken: String) async throws -> StoredTokens

    /// Opens the Cognito hosted-UI logout endpoint to clear the IdP-side session.
    /// Best-effort — failure does not block client-side logout.
    func logout() async
}

/// Production implementation backed by `ASWebAuthenticationSession` + URLSession.
final class CognitoOIDCClient: OIDCClient, @unchecked Sendable {
    init() {}

    func authorize() async throws -> StoredTokens {
        let pkce = PKCE.generate()
        let state = UUID().uuidString

        let callbackURL = try await launchAuthSession(pkce: pkce, state: state)
        let code = try extractCode(from: callbackURL, expectedState: state)
        return try await exchangeCode(code, codeVerifier: pkce.verifier)
    }

    func refresh(refreshToken: String) async throws -> StoredTokens {
        let body = formURLEncoded([
            "grant_type": "refresh_token",
            "client_id": OIDCConfiguration.clientID,
            "refresh_token": refreshToken,
        ])
        let response: TokenResponse = try await postTokenRequest(body: body)
        return StoredTokens(
            idToken: response.id_token,
            accessToken: response.access_token,
            // Cognito returns no refresh_token on refresh — keep the existing one.
            refreshToken: response.refresh_token ?? refreshToken,
            accessTokenExpiresAt: Date().timeIntervalSince1970 + Double(response.expires_in)
        )
    }

    func logout() async {
        var components = URLComponents(url: OIDCConfiguration.logoutEndpoint, resolvingAgainstBaseURL: false)
        components?.queryItems = [
            URLQueryItem(name: "client_id", value: OIDCConfiguration.clientID),
            URLQueryItem(name: "logout_uri", value: OIDCConfiguration.logoutRedirectURI),
        ]
        guard let url = components?.url else { return }
        // Fire and forget — Cognito 302s to logout_uri (kairos://) which we don't follow.
        _ = try? await URLSession.shared.data(from: url)
    }

    // MARK: - PKCE flow internals

    private func launchAuthSession(pkce: PKCE, state: String) async throws -> URL {
        var components = URLComponents(url: OIDCConfiguration.authorizationEndpoint, resolvingAgainstBaseURL: false)!
        components.queryItems = [
            URLQueryItem(name: "response_type", value: "code"),
            URLQueryItem(name: "client_id", value: OIDCConfiguration.clientID),
            URLQueryItem(name: "redirect_uri", value: OIDCConfiguration.redirectURI),
            URLQueryItem(name: "scope", value: OIDCConfiguration.scopes.joined(separator: " ")),
            URLQueryItem(name: "state", value: state),
            URLQueryItem(name: "code_challenge", value: pkce.challenge),
            URLQueryItem(name: "code_challenge_method", value: "S256"),
        ]
        guard let url = components.url else {
            throw AppError.authFailed(reason: "Failed to build authorize URL")
        }

        return try await withCheckedThrowingContinuation { continuation in
            Task { @MainActor in
                let session = ASWebAuthenticationSession(
                    url: url,
                    callbackURLScheme: OIDCConfiguration.callbackScheme
                ) { callbackURL, error in
                    if let error = error as? ASWebAuthenticationSessionError, error.code == .canceledLogin {
                        continuation.resume(throwing: AppError.authCancelled)
                        return
                    }
                    if let error {
                        continuation.resume(throwing: AppError.authFailed(reason: error.localizedDescription))
                        return
                    }
                    guard let callbackURL else {
                        continuation.resume(throwing: AppError.authFailed(reason: "No callback URL"))
                        return
                    }
                    continuation.resume(returning: callbackURL)
                }
                session.presentationContextProvider = PresentationAnchorProvider.shared
                session.prefersEphemeralWebBrowserSession = false
                if !session.start() {
                    continuation.resume(throwing: AppError.authFailed(reason: "Could not start auth session"))
                }
            }
        }
    }

    private func extractCode(from url: URL, expectedState: String) throws -> String {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
              let items = components.queryItems else {
            throw AppError.authFailed(reason: "Malformed callback URL")
        }
        if let error = items.first(where: { $0.name == "error" })?.value {
            throw AppError.authFailed(reason: error)
        }
        let returnedState = items.first(where: { $0.name == "state" })?.value
        guard returnedState == expectedState else {
            throw AppError.authFailed(reason: "State mismatch")
        }
        guard let code = items.first(where: { $0.name == "code" })?.value else {
            throw AppError.authFailed(reason: "Missing authorization code")
        }
        return code
    }

    private func exchangeCode(_ code: String, codeVerifier: String) async throws -> StoredTokens {
        let body = formURLEncoded([
            "grant_type": "authorization_code",
            "client_id": OIDCConfiguration.clientID,
            "code": code,
            "redirect_uri": OIDCConfiguration.redirectURI,
            "code_verifier": codeVerifier,
        ])
        let response: TokenResponse = try await postTokenRequest(body: body)
        guard let refreshToken = response.refresh_token else {
            throw AppError.authFailed(reason: "Missing refresh token in response")
        }
        return StoredTokens(
            idToken: response.id_token,
            accessToken: response.access_token,
            refreshToken: refreshToken,
            accessTokenExpiresAt: Date().timeIntervalSince1970 + Double(response.expires_in)
        )
    }

    private func postTokenRequest(body: Data) async throws -> TokenResponse {
        var request = URLRequest(url: OIDCConfiguration.tokenEndpoint)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.httpBody = body

        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await URLSession.shared.data(for: request)
        } catch {
            throw AppError.authFailed(reason: error.localizedDescription)
        }

        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            let body = String(data: data, encoding: .utf8) ?? "<no body>"
            throw AppError.authFailed(reason: "Token endpoint returned non-2xx: \(body)")
        }
        do {
            return try JSONDecoder().decode(TokenResponse.self, from: data)
        } catch {
            throw AppError.authFailed(reason: "Failed to decode token response: \(error.localizedDescription)")
        }
    }

    private func formURLEncoded(_ params: [String: String]) -> Data {
        let encoded = params
            .map { key, value in
                let safeKey = key.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? key
                let safeValue = value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? value
                return "\(safeKey)=\(safeValue)"
            }
            .joined(separator: "&")
        return Data(encoded.utf8)
    }
}

// MARK: - Token endpoint payload

private struct TokenResponse: Decodable {
    let id_token: String
    let access_token: String
    let refresh_token: String?
    let expires_in: Int
}

// MARK: - PKCE helper

struct PKCE: Equatable, Sendable {
    let verifier: String
    let challenge: String

    static func generate() -> PKCE {
        let verifier = randomURLSafeString(byteCount: 32)
        let digest = SHA256.hash(data: Data(verifier.utf8))
        let challenge = Data(digest).base64URLEncodedString()
        return PKCE(verifier: verifier, challenge: challenge)
    }

    private static func randomURLSafeString(byteCount: Int) -> String {
        var bytes = [UInt8](repeating: 0, count: byteCount)
        _ = SecRandomCopyBytes(kSecRandomDefault, byteCount, &bytes)
        return Data(bytes).base64URLEncodedString()
    }
}

extension Data {
    func base64URLEncodedString() -> String {
        base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
    }
}

// MARK: - Presentation anchor

@MainActor
private final class PresentationAnchorProvider: NSObject, ASWebAuthenticationPresentationContextProviding {
    static let shared = PresentationAnchorProvider()

    nonisolated func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        MainActor.assumeIsolated {
            UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .flatMap(\.windows)
                .first(where: \.isKeyWindow)
            ?? ASPresentationAnchor()
        }
    }
}
