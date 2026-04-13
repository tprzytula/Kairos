import Foundation

/// Mirrors `packages/shared/types/noiseTracking.ts`.
struct NoiseTrackingItem: Codable, Identifiable, Sendable, Equatable {
    let id: String
    /// Unix timestamp in milliseconds. Also used as the delete path parameter.
    let timestamp: Int
    let projectId: String
    var visibility: String?
    var ownerId: String?
}
