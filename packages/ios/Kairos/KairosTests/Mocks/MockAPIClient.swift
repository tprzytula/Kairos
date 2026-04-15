import Foundation
@testable import Kairos

/// In-memory `APIClient` for store tests. Records every call (method, endpoint,
/// scope, body) and returns pre-seeded responses matched by method + endpoint.
///
/// Seed responses with `stub(method:endpoint:response:)`. Unstubbed calls throw
/// `MockAPIClient.Error.notStubbed` so tests fail loudly instead of silently
/// swallowing unexpected traffic.
final class MockAPIClient: APIClient, @unchecked Sendable {

    enum Error: Swift.Error, Equatable {
        case notStubbed(method: String, endpoint: String)
    }

    struct RecordedCall: Sendable, Equatable {
        let method: String
        let endpoint: Endpoint
        let projectScoped: Bool
        let bodyJSON: String?
    }

    private let lock = NSLock()
    private var _calls: [RecordedCall] = []
    /// Responses pre-encoded to JSON so the mock doesn't have to carry `Any`.
    private var stubs: [String: Data] = [:]
    /// Stubs that throw instead of returning.
    private var errorStubs: [String: Swift.Error] = [:]

    var calls: [RecordedCall] {
        withLock { _calls }
    }

    // MARK: - Stubbing

    func stub<T: Encodable & Sendable>(
        method: String,
        endpoint: Endpoint,
        response: T
    ) {
        let data = (try? JSONEncoder().encode(response)) ?? Data()
        withLock { stubs[key(method: method, endpoint: endpoint)] = data }
    }

    func stubError(method: String, endpoint: Endpoint, error: Swift.Error) {
        withLock { errorStubs[key(method: method, endpoint: endpoint)] = error }
    }

    // MARK: - APIClient

    func get<T: Decodable & Sendable>(endpoint: Endpoint, projectScoped: Bool) async throws -> T {
        try perform(method: "GET", endpoint: endpoint, body: Optional<EmptyBody>.none, projectScoped: projectScoped)
    }

    func put<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body,
        projectScoped: Bool
    ) async throws -> Response {
        try perform(method: "PUT", endpoint: endpoint, body: body, projectScoped: projectScoped)
    }

    func post<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body,
        projectScoped: Bool
    ) async throws -> Response {
        try perform(method: "POST", endpoint: endpoint, body: body, projectScoped: projectScoped)
    }

    func patch<Body: Encodable & Sendable, Response: Decodable & Sendable>(
        endpoint: Endpoint,
        body: Body,
        projectScoped: Bool
    ) async throws -> Response {
        try perform(method: "PATCH", endpoint: endpoint, body: body, projectScoped: projectScoped)
    }

    func delete(endpoint: Endpoint, projectScoped: Bool) async throws {
        let _: EmptyResponse = try perform(
            method: "DELETE",
            endpoint: endpoint,
            body: Optional<EmptyBody>.none,
            projectScoped: projectScoped
        )
    }

    // MARK: - Internal

    private func perform<Body: Encodable, Response: Decodable>(
        method: String,
        endpoint: Endpoint,
        body: Body?,
        projectScoped: Bool
    ) throws -> Response {
        let stubKey = key(method: method, endpoint: endpoint)
        let bodyJSON = Self.encodeForRecording(body)

        let (error, data): (Swift.Error?, Data?) = withLock {
            _calls.append(
                RecordedCall(method: method, endpoint: endpoint, projectScoped: projectScoped, bodyJSON: bodyJSON)
            )
            return (errorStubs[stubKey], stubs[stubKey])
        }

        if let error {
            throw error
        }

        if Response.self == EmptyResponse.self {
            return EmptyResponse() as! Response
        }

        guard let data else {
            throw Error.notStubbed(method: method, endpoint: endpoint.path)
        }
        return try JSONDecoder().decode(Response.self, from: data)
    }

    private func key(method: String, endpoint: Endpoint) -> String {
        "\(method) \(endpoint.path)"
    }

    private static func encodeForRecording(_ body: Encodable?) -> String? {
        guard let body else { return nil }
        do {
            let data = try JSONEncoder().encode(AnyEncodable(body))
            return String(data: data, encoding: .utf8)
        } catch {
            return nil
        }
    }

    private func withLock<R>(_ body: () -> R) -> R {
        lock.lock(); defer { lock.unlock() }
        return body()
    }
}

/// Type-erases an `Encodable` so we can encode request bodies for recording.
private struct AnyEncodable: Encodable {
    private let encodeFn: (Encoder) throws -> Void
    init(_ wrapped: Encodable) {
        self.encodeFn = { encoder in try wrapped.encode(to: encoder) }
    }
    func encode(to encoder: Encoder) throws { try encodeFn(encoder) }
}
