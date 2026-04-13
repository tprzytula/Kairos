import Foundation

/// Mirrors `packages/shared/types/adventure.ts`.
struct Adventure: Codable, Identifiable, Sendable, Equatable {
    let id: String
    let projectId: String
    var name: String
    /// ISO date string (e.g. "2026-03-15").
    var date: String
    var endDate: String?
    /// Time-of-day string (e.g. "14:30").
    var time: String?
    var endTime: String?
    var location: String?
    var notes: String?
    var imagePath: String?
    let createdAt: String
    var updatedAt: String
    var visibility: String?
    var ownerId: String?
}
