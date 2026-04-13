import Foundation

/// App-level errors surfaced to the UI. Networking errors live in `APIError`.
enum AppError: Error, Equatable, Sendable {
    case authCancelled
    case authFailed(reason: String)
    case missingToken
    case decodingFailed(reason: String)
    case unknown(reason: String)
}

extension AppError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .authCancelled: "Sign-in was cancelled."
        case .authFailed(let reason): "Sign-in failed: \(reason)"
        case .missingToken: "No authentication token available."
        case .decodingFailed(let reason): "Failed to decode response: \(reason)"
        case .unknown(let reason): reason
        }
    }
}
