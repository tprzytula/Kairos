import Foundation

/// Web-app type (not in shared types).
/// IMPORTANT: `quantity` is a String on the wire (e.g. "5"). Convert to `Double`
/// at the UI layer if needed.
struct GroceryItem: Codable, Identifiable, Sendable, Equatable {
    let id: String
    var name: String
    var quantity: String
    var unit: GroceryItemUnit
    var shopId: String
    var imagePath: String?
    var category: String?
    var visibility: String?
    var ownerId: String?
}

/// User-scoped autocomplete defaults for grocery items.
/// `name` doubles as the path parameter for PATCH/DELETE.
struct GroceryItemDefault: Codable, Sendable, Equatable {
    var name: String
    var unit: GroceryItemUnit?
    var icon: String?
    var category: String?
}
