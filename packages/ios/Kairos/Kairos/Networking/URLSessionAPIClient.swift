import Foundation

/// Default `APIClient` implementation backed by `URLSession` + `async/await`.
///
/// Tokens are pulled from injected closures rather than a direct `AuthStore`
/// reference so the client is testable in isolation and so we can break the
/// cycle between `AuthStore` (needs the client to refresh) and the client
/// (needs the store for tokens).
final class URLSessionAPIClient: APIClient {
    typealias TokenProvider = @Sendable () async -> String?
    typealias ProjectIdProvider = @Sendable () async -> String?

    private let session: URLSession
    private let baseURL: URL
    private let idTokenProvider: TokenProvider
    private let accessTokenProvider: TokenProvider
    private let projectIdProvider: ProjectIdProvider

    init(
        session: URLSession = .shared,
        baseURL: URL = APIConfiguration.baseURL,
        idTokenProvider: @escaping TokenProvider = { nil },
        accessTokenProvider: @escaping TokenProvider = { nil },
        projectIdProvider: @escaping ProjectIdProvider = { nil }
    ) {
        self.session = session
        self.baseURL = baseURL
        self.idTokenProvider = idTokenProvider
        self.accessTokenProvider = accessTokenProvider
        self.projectIdProvider = projectIdProvider
    }

    func get<T: Decodable & Sendable>(
        endpoint: Endpoint,
        projectScoped: Bool
    ) async throws -> T {
        try await perform(endpoint: endpoint, method: "GET", body: Optional<EmptyBody>.none, projectScoped: projectScoped)
    }

    func put<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body,
        projectScoped: Bool
    ) async throws -> Response {
        try await perform(endpoint: endpoint, method: "PUT", body: body, projectScoped: projectScoped)
    }

    func post<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body,
        projectScoped: Bool
    ) async throws -> Response {
        try await perform(endpoint: endpoint, method: "POST", body: body, projectScoped: projectScoped)
    }

    func patch<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body,
        projectScoped: Bool
    ) async throws -> Response {
        try await perform(endpoint: endpoint, method: "PATCH", body: body, projectScoped: projectScoped)
    }

    func delete(endpoint: Endpoint, projectScoped: Bool) async throws {
        let _: EmptyResponse = try await perform(
            endpoint: endpoint,
            method: "DELETE",
            body: Optional<EmptyBody>.none,
            projectScoped: projectScoped
        )
    }

    // MARK: - Internals

    private func perform<Body: Encodable, Response: Decodable>(
        endpoint: Endpoint,
        method: String,
        body: Body?,
        projectScoped: Bool
    ) async throws -> Response {
        let request = try await buildRequest(
            endpoint: endpoint,
            method: method,
            body: body,
            projectScoped: projectScoped
        )

        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            throw APIError.transport(reason: error.localizedDescription)
        }

        guard let http = response as? HTTPURLResponse else {
            throw APIError.nonHTTPResponse
        }

        guard (200..<300).contains(http.statusCode) else {
            let body = String(data: data, encoding: .utf8)
            throw APIError.http(status: http.statusCode, body: body)
        }

        if Response.self == EmptyResponse.self {
            return EmptyResponse() as! Response
        }

        if data.isEmpty {
            // Some 2xx endpoints return empty bodies — surface a decoded
            // EmptyResponse if that's what was asked for, otherwise fail loudly.
            throw APIError.decodingFailed(reason: "Empty response body")
        }

        do {
            return try JSONDecoder().decode(Response.self, from: data)
        } catch {
            throw APIError.decodingFailed(reason: error.localizedDescription)
        }
    }

    /// Exposed `internal` so tests can verify request construction without
    /// going through `URLSession`.
    func buildRequest<Body: Encodable>(
        endpoint: Endpoint,
        method: String,
        body: Body?,
        projectScoped: Bool
    ) async throws -> URLRequest {
        let url = try buildURL(for: endpoint)
        var request = URLRequest(url: url)
        request.httpMethod = method

        if projectScoped {
            guard let idToken = await idTokenProvider(), !idToken.isEmpty else {
                throw APIError.unauthenticated
            }
            request.setValue("Bearer \(idToken)", forHTTPHeaderField: "Authorization")
            let projectId = await projectIdProvider() ?? APIConfiguration.fallbackProjectId
            request.setValue(projectId, forHTTPHeaderField: "X-Project-ID")
        } else {
            guard let accessToken = await accessTokenProvider(), !accessToken.isEmpty else {
                throw APIError.unauthenticated
            }
            request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        }

        if let body, !(body is EmptyBody) {
            do {
                request.httpBody = try JSONEncoder().encode(body)
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            } catch {
                throw APIError.encodingFailed(reason: error.localizedDescription)
            }
        }

        return request
    }

    private func buildURL(for endpoint: Endpoint) throws -> URL {
        // Append path components manually so the base URL's `/v1` prefix is preserved.
        let pathURL = baseURL.appendingPathComponent(endpoint.path)
        guard var components = URLComponents(url: pathURL, resolvingAgainstBaseURL: false) else {
            throw APIError.invalidURL
        }
        let queryItems = endpoint.queryItems
        if !queryItems.isEmpty {
            components.queryItems = queryItems
        }
        guard let url = components.url else {
            throw APIError.invalidURL
        }
        return url
    }
}
