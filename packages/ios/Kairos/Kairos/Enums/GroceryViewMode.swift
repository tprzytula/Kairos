import Foundation

/// Mirrors `packages/web/src/enums/groceryCategory.ts` (web-only).
enum GroceryViewMode: String, Codable, Sendable {
    case categorized
    case alphabetical
    case uncategorized
}
