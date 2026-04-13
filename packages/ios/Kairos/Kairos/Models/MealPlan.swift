import Foundation

/// Mirrors `packages/shared/types/mealPlan.ts`.
struct MealPlan: Codable, Identifiable, Sendable, Equatable {
    let id: String
    let projectId: String
    /// ISO date string.
    var date: String
    var recipeName: String
    var recipeId: String?
    var mealType: MealType?
    var imagePath: String?
    let createdAt: String
    var updatedAt: String
    var visibility: String?
    var ownerId: String?
}
