import Foundation

/// Errors thrown by `APIClient` implementations.
enum APIError: Error, Equatable, Sendable {
    /// Server returned a non-2xx status. `body` is the raw response body if available.
    case http(status: Int, body: String?)
    /// `URLResponse` wasn't an `HTTPURLResponse` (shouldn't happen with HTTP URLs).
    case nonHTTPResponse
    /// Failed to construct a valid request URL from the endpoint.
    case invalidURL
    /// Body decoding failed.
    case decodingFailed(reason: String)
    /// Body encoding failed.
    case encodingFailed(reason: String)
    /// Required token missing from `AuthStore` for the requested scope.
    case unauthenticated
    /// Underlying transport error (URLSession failure, no network, etc.).
    case transport(reason: String)
}

extension APIError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .http(let status, _): "HTTP \(status)"
        case .nonHTTPResponse: "Non-HTTP response"
        case .invalidURL: "Invalid URL"
        case .decodingFailed(let reason): "Decoding failed: \(reason)"
        case .encodingFailed(let reason): "Encoding failed: \(reason)"
        case .unauthenticated: "Not authenticated"
        case .transport(let reason): "Network error: \(reason)"
        }
    }
}
