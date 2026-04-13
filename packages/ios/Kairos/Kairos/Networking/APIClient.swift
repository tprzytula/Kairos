import Foundation

/// Abstraction over the Kairos REST API. Implementations are responsible for
/// injecting auth headers and the `X-Project-ID` header for project-scoped
/// requests. See `docs/ios-rewrite/01-cross-cutting.md` → Auth Token Injection.
protocol APIClient: Sendable {
    func get<T: Decodable & Sendable>(
        endpoint: Endpoint,
        projectScoped: Bool
    ) async throws -> T

    func put<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body,
        projectScoped: Bool
    ) async throws -> Response

    func post<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body,
        projectScoped: Bool
    ) async throws -> Response

    func patch<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body,
        projectScoped: Bool
    ) async throws -> Response

    func delete(endpoint: Endpoint, projectScoped: Bool) async throws
}

extension APIClient {
    func get<T: Decodable & Sendable>(endpoint: Endpoint) async throws -> T {
        try await get(endpoint: endpoint, projectScoped: true)
    }

    func put<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body
    ) async throws -> Response {
        try await put(endpoint: endpoint, body: body, projectScoped: true)
    }

    func post<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body
    ) async throws -> Response {
        try await post(endpoint: endpoint, body: body, projectScoped: true)
    }

    func patch<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body
    ) async throws -> Response {
        try await patch(endpoint: endpoint, body: body, projectScoped: true)
    }

    func delete(endpoint: Endpoint) async throws {
        try await delete(endpoint: endpoint, projectScoped: true)
    }
}

/// A no-op body for endpoints that take no JSON payload (GET, DELETE).
struct EmptyBody: Encodable, Sendable {}

/// A no-content response for endpoints that return only a status code.
struct EmptyResponse: Decodable, Sendable {
    init() {}
    init(from decoder: Decoder) throws {}
}

/// Response of `PUT /<resource>` create endpoints — most return `{ id }`.
struct CreatedResource: Codable, Sendable, Equatable {
    let id: String
}
