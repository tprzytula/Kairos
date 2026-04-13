import Foundation

/// Mirrors `packages/shared/types/birthday.ts`.
struct Birthday: Codable, Identifiable, Sendable, Equatable {
    let id: String
    let projectId: String
    var name: String
    var month: Int
    var day: Int
    var birthYear: Int?
    var notes: String?
    var visibility: String?
    var ownerId: String?
}
