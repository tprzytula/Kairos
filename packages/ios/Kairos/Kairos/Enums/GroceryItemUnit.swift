import Foundation

/// Mirrors `packages/shared/enums/groceryItemUnit.ts`.
enum GroceryItemUnit: String, Codable, CaseIterable, Sendable {
    case bag = "bag(s)"
    case bottle = "bottle(s)"
    case box = "box(es)"
    case can = "can(s)"
    case gram = "g"
    case kilogram = "kg"
    case liter = "l"
    case milliliter = "ml"
    case roll = "roll(s)"
    case unit = "unit(s)"
}
