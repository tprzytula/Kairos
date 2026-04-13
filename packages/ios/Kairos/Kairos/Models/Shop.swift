import Foundation

/// Mirrors `packages/shared/types/shop.ts`.
struct Shop: Codable, Identifiable, Sendable, Equatable {
    let id: String
    let projectId: String
    var name: String
    var icon: String?
    let createdAt: String
    var updatedAt: String
    var visibility: String?
    var ownerId: String?
}
