import Foundation

/// Mirrors `packages/web/src/enums/groceryCategory.ts` (web-only).
enum GroceryCategory: String, Codable, CaseIterable, Sendable {
    case produce
    case dairy
    case meat
    case frozen
    case bakery
    case pantry
    case beverages
    case household
    case other

    var displayName: String {
        switch self {
        case .produce: "Fruits & Vegetables"
        case .dairy: "Dairy"
        case .meat: "Meat & Poultry"
        case .frozen: "Frozen Foods"
        case .bakery: "Bakery & Grains"
        case .pantry: "Pantry & Grains"
        case .beverages: "Beverages"
        case .household: "Household"
        case .other: "Other"
        }
    }

    static let displayOrder: [GroceryCategory] = [
        .produce, .dairy, .meat, .frozen, .bakery, .pantry, .beverages, .household, .other
    ]
}
