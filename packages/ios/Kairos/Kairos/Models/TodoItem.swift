import Foundation

/// Mirrors `packages/shared/types/todoItem.ts`.
/// `steps` is added by the web API layer, not the shared type.
struct TodoItem: Codable, Identifiable, Sendable, Equatable {
    let id: String
    let projectId: String
    var name: String
    var description: String?
    /// Unix timestamp in milliseconds.
    var dueDate: Int?
    var isDone: Bool
    var steps: [TodoStep]?
    var visibility: String?
    var ownerId: String?
}

struct TodoStep: Codable, Identifiable, Sendable, Equatable {
    let id: String
    var name: String
    var isDone: Bool
}
