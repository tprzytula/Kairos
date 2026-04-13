import Foundation

/// All HTTP endpoints exposed by the Kairos backend.
/// Source of truth: `docs/ios-rewrite/api-reference.md` (derived from
/// `packages/infra/modules/api_gateway/openapi/*.yml`).
enum Endpoint: Sendable, Equatable {
    // MARK: Shops
    case shops
    case shop(id: String)
    case shopsUploadUrl(fileExtension: String)

    // MARK: Grocery items
    case groceryItems(shopId: String?)
    case groceryItem(id: String)

    // MARK: Grocery item defaults (user-scoped, NO X-Project-ID)
    case groceryItemDefaults
    case groceryItemDefault(name: String)
    case groceryItemDefaultsUploadUrl(fileExtension: String)

    // MARK: To-do items
    case todoItems
    case todoItem(id: String)

    // MARK: Recipes
    case recipes
    case recipe(id: String)
    case recipesUploadUrl(fileExtension: String)

    // MARK: Meal plans
    case mealPlans
    case mealPlan(id: String)
    case mealPlansUploadUrl(fileExtension: String)

    // MARK: Adventures
    case adventures
    case adventure(id: String)
    case adventuresUploadUrl(fileExtension: String)

    // MARK: Birthdays
    case birthdays
    case birthday(id: String)

    // MARK: Noise tracking
    case noiseTrackingItems
    case noiseTrackingItem(timestamp: Int)

    // MARK: Office attendance
    case officeAttendance
    case officeAttendanceItem(id: String)

    // MARK: Projects (mostly user-scoped — see api-reference.md)
    case projects
    case joinProject
    /// Public — no auth required.
    case projectInvite(code: String)
    /// Requires X-Project-ID even though the rest of /projects is user-scoped.
    case projectMembers
    case projectMember(userId: String)

    // MARK: User preferences (user-scoped)
    case userPreferences

    // MARK: Push subscriptions (user-scoped)
    case pushSubscriptions
    case pushSubscriptionByEndpoint(endpoint: String)

    /// URL path component. Excludes the leading slash and base URL.
    var path: String {
        switch self {
        case .shops: "shops"
        case .shop(let id): "shops/\(id)"
        case .shopsUploadUrl: "shops/upload-url"

        case .groceryItems: "grocery_list/items"
        case .groceryItem(let id): "grocery_list/items/\(id)"

        case .groceryItemDefaults: "grocery_list/items_defaults"
        case .groceryItemDefault(let name):
            "grocery_list/items_defaults/\(percentEncodePathSegment(name))"
        case .groceryItemDefaultsUploadUrl: "grocery_list/items_defaults/upload-url"

        case .todoItems: "todo_list/items"
        case .todoItem(let id): "todo_list/items/\(id)"

        case .recipes: "recipes"
        case .recipe(let id): "recipes/\(id)"
        case .recipesUploadUrl: "recipes/upload-url"

        case .mealPlans: "meal-plans"
        case .mealPlan(let id): "meal-plans/\(id)"
        case .mealPlansUploadUrl: "meal-plans/upload-url"

        case .adventures: "adventures"
        case .adventure(let id): "adventures/\(id)"
        case .adventuresUploadUrl: "adventures/upload-url"

        case .birthdays: "birthdays/items"
        case .birthday(let id): "birthdays/items/\(id)"

        case .noiseTrackingItems: "noise_tracking/items"
        case .noiseTrackingItem(let timestamp): "noise_tracking/items/\(timestamp)"

        case .officeAttendance: "office-attendance"
        case .officeAttendanceItem(let id): "office-attendance/\(id)"

        case .projects: "projects"
        case .joinProject: "projects/join"
        case .projectInvite(let code): "projects/invite/\(code)"
        case .projectMembers: "projects/members"
        case .projectMember(let userId): "projects/members/\(userId)"

        case .userPreferences: "user/preferences"

        case .pushSubscriptions: "push-subscriptions"
        case .pushSubscriptionByEndpoint: "push-subscriptions"
        }
    }

    /// Optional query items appended to the URL.
    var queryItems: [URLQueryItem] {
        switch self {
        case .groceryItems(let shopId):
            if let shopId { return [URLQueryItem(name: "shopId", value: shopId)] }
            return []
        case .shopsUploadUrl(let ext),
             .groceryItemDefaultsUploadUrl(let ext),
             .recipesUploadUrl(let ext),
             .mealPlansUploadUrl(let ext),
             .adventuresUploadUrl(let ext):
            return [URLQueryItem(name: "extension", value: ext)]
        case .pushSubscriptionByEndpoint(let endpoint):
            return [URLQueryItem(name: "endpoint", value: endpoint)]
        default:
            return []
        }
    }
}

/// Percent-encode a path segment so values containing spaces or reserved chars
/// (e.g. grocery default names) are URL-safe.
private func percentEncodePathSegment(_ value: String) -> String {
    value.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? value
}
