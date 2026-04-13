import Foundation

/// Mirrors `packages/shared/types/userPreferences.ts`.
struct UserPreferences: Codable, Sendable, Equatable {
    let userId: String
    var currentProjectId: String?
    var currentShopId: String?
    let lastUpdated: Int
}
