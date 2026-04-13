import Foundation

/// Web-app type (not in shared types).
struct Project: Codable, Identifiable, Sendable, Equatable {
    let id: String
    let ownerId: String
    var name: String
    let isPersonal: Bool
    let maxMembers: Int
    let inviteCode: String
    let createdAt: String
}

/// Returned by `GET /projects/invite/{inviteCode}` — public, no auth required.
struct ProjectInviteInfo: Codable, Sendable, Equatable {
    let id: String
    let name: String
    let memberCount: Int
    let maxMembers: Int
    var ownerName: String?
}
