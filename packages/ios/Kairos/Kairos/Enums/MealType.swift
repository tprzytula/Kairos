import Foundation

/// Mirrors `packages/shared/enums/mealType.ts`.
enum MealType: String, Codable, CaseIterable, Sendable {
    case breakfast = "Breakfast"
    case brunch = "Brunch"
    case lunch = "Lunch"
    case snack = "Snack"
    case dinner = "Dinner"
    case other = "Other"
}
