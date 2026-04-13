import Foundation

/// Mirrors `packages/shared/types/projectMemberDetails.ts`.
struct ProjectMember: Codable, Sendable, Equatable {
    let userId: String
    var name: String
    var givenName: String?
    var avatar: String?
    var role: ProjectRole
}
