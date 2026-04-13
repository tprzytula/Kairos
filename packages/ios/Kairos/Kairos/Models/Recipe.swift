import Foundation

/// Web-app type (not in shared types). See `models.md`.
struct Recipe: Codable, Identifiable, Sendable, Equatable {
    let id: String
    let projectId: String
    var name: String
    var imagePath: String?
    var externalLink: String?
    var ingredients: [RecipeIngredient]
    var instructions: [String]?
    var mealTypes: [MealType]?
    var dishTypes: [RecipeDishType]?
    let createdAt: String
    var updatedAt: String
    var visibility: String?
    var ownerId: String?
}

struct RecipeIngredient: Codable, Sendable, Equatable {
    var name: String
    var quantity: Double
    var unit: GroceryItemUnit
}
