# Model Layer

All models are `Codable` + `Identifiable` + `Sendable` structs. Field names match the JSON wire format exactly (camelCase, so default `CodingKeys` work).

**Source of truth for types**: `packages/shared/types/` and `packages/shared/enums/`.

## Verified Type Definitions

```swift
// From packages/shared/types/shop.ts
struct Shop: Codable, Identifiable, Sendable {
    let id: String
    let projectId: String
    var name: String
    var icon: String?
    let createdAt: String
    var updatedAt: String
    var visibility: String?    // "private" or nil
    var ownerId: String?
}

// From packages/shared/types/todoItem.ts
// Note: steps field is NOT in shared types — it's added by the web app's API layer
struct TodoItem: Codable, Identifiable, Sendable {
    let id: String
    let projectId: String
    var name: String
    var description: String?
    var dueDate: Int?           // Unix timestamp (milliseconds)
    var isDone: Bool
    var steps: [TodoStep]?      // Added by API, not in shared types
    var visibility: String?
    var ownerId: String?
}

struct TodoStep: Codable, Identifiable, Sendable {
    let id: String
    var name: String
    var isDone: Bool
}

// From packages/shared/types/adventure.ts
struct Adventure: Codable, Identifiable, Sendable {
    let id: String
    let projectId: String
    var name: String
    var date: String
    var endDate: String?
    var time: String?
    var endTime: String?
    var location: String?
    var notes: String?
    var imagePath: String?
    let createdAt: String
    var updatedAt: String
    var visibility: String?
    var ownerId: String?
}

// From packages/shared/types/birthday.ts
struct Birthday: Codable, Identifiable, Sendable {
    let id: String
    let projectId: String
    var name: String
    var month: Int
    var day: Int
    var birthYear: Int?
    var notes: String?
    var visibility: String?
    var ownerId: String?
}

// From packages/shared/types/mealPlan.ts
struct MealPlan: Codable, Identifiable, Sendable {
    let id: String
    let projectId: String
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

// From packages/shared/types/noiseTracking.ts
struct NoiseTrackingItem: Codable, Identifiable, Sendable {
    let id: String
    let timestamp: Int          // Unix timestamp
    let projectId: String
    var visibility: String?
    var ownerId: String?
}

// From packages/shared/types/officeAttendance.ts
struct OfficeAttendance: Codable, Identifiable, Sendable {
    let id: String
    let projectId: String
    var date: String
    var userId: String
    var userName: String
    var userAvatar: String?
    let createdBy: String
    let createdAt: String
}

// From packages/shared/types/userPreferences.ts
struct UserPreferences: Codable, Sendable {
    let userId: String
    var currentProjectId: String?
    var currentShopId: String?
    let lastUpdated: Int
}

// From packages/shared/types/projectMemberDetails.ts
struct ProjectMember: Codable, Sendable {
    let userId: String
    var name: String
    var givenName: String?
    var avatar: String?
    var role: ProjectRole
}

// Recipe — defined in web app only (not in shared types)
struct Recipe: Codable, Identifiable, Sendable {
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

struct RecipeIngredient: Codable, Sendable {
    var name: String
    var quantity: Double
    var unit: GroceryItemUnit
}

// GroceryItem — defined in web app only
// IMPORTANT: quantity is a String on the wire (e.g., "5"). Use custom Codable or
// a computed property to convert to/from Double for UI display.
struct GroceryItem: Codable, Identifiable, Sendable {
    let id: String
    var name: String
    var quantity: String       // String on the wire — convert to Double for display
    var unit: GroceryItemUnit
    var shopId: String
    var imagePath: String?
    var category: String?
    var visibility: String?    // "private" or nil (see isPrivate mapping in 01-cross-cutting.md)
    var ownerId: String?
}

// GroceryItemDefault — user-scoped autocomplete defaults for grocery items
// Used in grocery settings UI for managing default items
struct GroceryItemDefault: Codable, Sendable {
    var name: String           // Also used as the path parameter for PATCH/DELETE
    var unit: GroceryItemUnit?
    var icon: String?
    var category: String?
}

// Project — defined in web app only
struct Project: Codable, Identifiable, Sendable {
    let id: String
    let ownerId: String
    var name: String
    let isPersonal: Bool
    let maxMembers: Int
    let inviteCode: String
    let createdAt: String
}

// ProjectInviteInfo — returned by GET /projects/invite/{inviteCode} (public, no auth)
// Used in the join-project flow to preview a project before joining
struct ProjectInviteInfo: Codable, Sendable {
    let id: String
    let name: String
    let memberCount: Int
    let maxMembers: Int
    var ownerName: String?
}
```

## Verified Enum Definitions

```swift
// From packages/shared/enums/groceryItemUnit.ts
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

// From packages/shared/enums/mealType.ts
enum MealType: String, Codable, CaseIterable, Sendable {
    case breakfast = "Breakfast"
    case brunch = "Brunch"
    case lunch = "Lunch"
    case snack = "Snack"
    case dinner = "Dinner"
    case other = "Other"
}

// From packages/shared/enums/recipeDishType.ts
// All raw values explicit to match wire format exactly
enum RecipeDishType: String, Codable, CaseIterable, Sendable {
    case pasta = "pasta"
    case soup = "soup"
    case salad = "salad"
    case bakedGoods = "baked_goods"
    case rice = "rice"
    case stew = "stew"
    case stirFry = "stir_fry"
    case sandwich = "sandwich"
}

// From packages/shared/types/project.ts
enum ProjectRole: String, Codable, Sendable {
    case owner, member
}

// From packages/web/src/enums/groceryCategory.ts (web-only)
enum GroceryCategory: String, Codable, CaseIterable, Sendable {
    case produce, dairy, meat, frozen, bakery, pantry, beverages, household, other

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

// From packages/web/src/enums/groceryCategory.ts (web-only)
enum GroceryViewMode: String, Codable, Sendable {
    case categorized, alphabetical, uncategorized
}

// From packages/web/src/enums/plannerViewMode.ts (web-only)
enum PlannerViewMode: String, Codable, Sendable {
    case calendar, weekly, grouped
}
```
