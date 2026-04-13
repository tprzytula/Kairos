import Foundation

/// Mirrors the `role` field on `packages/shared/types/projectMemberDetails.ts`.
enum ProjectRole: String, Codable, Sendable {
    case owner
    case member
}
