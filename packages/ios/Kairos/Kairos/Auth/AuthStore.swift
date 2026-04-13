import Foundation
import Observation

/// Owns the OIDC token bundle. Mirrors the responsibilities of
/// `react-oidc-context` in the web app — login, logout, foreground refresh.
///
/// The store is `@MainActor` because views read its observable state directly
/// and the OIDC presentation API is main-actor bound. Token providers exposed
/// to `APIClient` hop to main internally.
@MainActor
@Observable
final class AuthStore {
    /// Whether the user has a usable session (tokens present, not expired
    /// or refresh available).
    var isAuthenticated: Bool = false

    /// True while a sign-in or refresh is in flight.
    var isLoading: Bool = false

    /// True if the most recent auth operation failed. Cleared on the next success.
    var isError: Bool = false

    /// Last error surfaced to the UI. Used by `LoginView` to show a message.
    var lastErrorMessage: String?

    private let oidcClient: OIDCClient
    private let keychainService: KeychainService
    private(set) var tokens: StoredTokens?

    init(oidcClient: OIDCClient, keychainService: KeychainService) {
        self.oidcClient = oidcClient
        self.keychainService = keychainService
    }

    // MARK: - Public API

    /// Read tokens from Keychain on app launch. If found, refresh them so the
    /// session is ready for any immediate API calls.
    func restoreSession() async {
        do {
            guard let stored = try keychainService.loadTokens() else {
                isAuthenticated = false
                return
            }
            tokens = stored
            isAuthenticated = true
            // Proactively refresh if the access token is close to expiry. If
            // refresh fails, we keep the session — `refreshIfNeeded` may
            // succeed later, and the user can sign in again if not.
            if stored.isExpired(leeway: OIDCConfiguration.refreshLeewaySeconds) {
                try? await refreshTokens()
            }
        } catch {
            print("AuthStore.restoreSession failed: \(error.localizedDescription)")
            isAuthenticated = false
        }
    }

    /// Launches the OIDC flow. On success, persists tokens and flips
    /// `isAuthenticated` to true.
    func signIn() async {
        isLoading = true
        isError = false
        lastErrorMessage = nil
        defer { isLoading = false }

        do {
            let newTokens = try await oidcClient.authorize()
            try keychainService.saveTokens(newTokens)
            tokens = newTokens
            isAuthenticated = true
        } catch let error as AppError where error == .authCancelled {
            // User cancellation — surface no error.
        } catch {
            isError = true
            lastErrorMessage = error.localizedDescription
            print("AuthStore.signIn failed: \(error.localizedDescription)")
        }
    }

    /// Sign in with Apple — UI surface is wired but the backend half (Cognito
    /// user-pool client must accept Apple as an IdP) is not yet in place. This
    /// is tracked in PROGRESS.md as a Phase 9/10 prerequisite for App Store
    /// submission (Guideline 4.8 requires Sign in with Apple alongside Google).
    func signInWithApple() async {
        isError = true
        lastErrorMessage = "Sign in with Apple is being set up. Please continue with Google for now."
    }

    /// Clears tokens and (best-effort) ends the IdP session.
    func signOut() async {
        await oidcClient.logout()
        try? keychainService.clear()
        tokens = nil
        isAuthenticated = false
        isError = false
        lastErrorMessage = nil
    }

    /// Refreshes tokens if the access token is past or near expiry. Called by
    /// the app on `scenePhase` change to `.active` (mirrors the web app's
    /// `visibilitychange` refresh).
    func refreshIfNeeded() async {
        guard let current = tokens else { return }
        guard current.isExpired(leeway: OIDCConfiguration.refreshLeewaySeconds) else { return }
        try? await refreshTokens()
    }

    // MARK: - Token access (used by APIClient)

    /// Token-provider closure compatible with `URLSessionAPIClient`.
    nonisolated func idTokenProvider() -> @Sendable () async -> String? {
        let store = self
        return { await store.tokens?.idToken }
    }

    nonisolated func accessTokenProvider() -> @Sendable () async -> String? {
        let store = self
        return { await store.tokens?.accessToken }
    }

    // MARK: - Internal

    private func refreshTokens() async throws {
        guard let current = tokens else { return }
        do {
            let refreshed = try await oidcClient.refresh(refreshToken: current.refreshToken)
            try keychainService.saveTokens(refreshed)
            tokens = refreshed
            isAuthenticated = true
            isError = false
        } catch {
            print("AuthStore.refreshTokens failed: \(error.localizedDescription)")
            // If the refresh token is no longer valid (e.g. revoked), tear down
            // the session so the user gets back to LoginView.
            try? keychainService.clear()
            tokens = nil
            isAuthenticated = false
            throw error
        }
    }
}
