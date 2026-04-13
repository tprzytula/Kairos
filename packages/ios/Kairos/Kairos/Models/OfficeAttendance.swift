import Foundation

/// Mirrors `packages/shared/types/officeAttendance.ts`.
struct OfficeAttendance: Codable, Identifiable, Sendable, Equatable {
    let id: String
    let projectId: String
    /// ISO date string.
    var date: String
    var userId: String
    var userName: String
    var userAvatar: String?
    let createdBy: String
    let createdAt: String
}
