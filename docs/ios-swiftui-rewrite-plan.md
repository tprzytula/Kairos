# Kairos iOS App — SwiftUI Rewrite Plan

## Context

Kairos is a productivity PWA (React 19 + MUI + TanStack Query) with an AWS serverless backend (Cognito, API Gateway, Lambda, DynamoDB). The frontend has 70+ components, 12 context providers, 10 domain areas, and complex gesture-based UI (swipeable lists, draggable drawers, pull-to-refresh). This plan creates a new `packages/ios/` package containing a native SwiftUI app that replaces the web frontend while reusing the existing backend unchanged (except one Cognito callback URL addition).

---

## Architecture

### Pattern: @Observable Stores (not MVVM)

Each React Context provider maps 1:1 to an `@Observable` class ("Store") injected via SwiftUI `.environment()`. No separate ViewModel layer — views read store properties directly. This matches how the web app already works (providers expose state + methods, components consume them).

| React Provider | Swift Store |
|---|---|
| AuthProvider | `AuthStore` |
| ProjectProvider | `ProjectStore` |
| AppStateProvider | `AppStateStore` |
| ShopProvider | `ShopStore` |
| GroceryListProvider | `GroceryStore` |
| PlannerProvider | `PlannerStore` |
| RecipeProvider | `RecipeStore` |
| MealPlanProvider | `MealPlanStore` |
| AdventureProvider | `AdventureStore` |
| BirthdayProvider | `BirthdayStore` |
| NoiseTrackingProvider | `NoiseTrackingStore` |
| OfficeAttendanceProvider | `OfficeAttendanceStore` |
| ProjectMembersProvider | `ProjectMembersStore` |

### React → SwiftUI Concept Map

| React | SwiftUI |
|---|---|
| `useState` | `@State` |
| `useContext` + Provider | `@Environment` + `.environment()` |
| `useEffect` | `.task` / `.onChange` / `.onAppear` |
| TanStack Query | `@Observable` store with async fetch methods |
| React Router | `NavigationStack` + `TabView` |
| MUI components | Native SwiftUI views |
| Styled components | `ViewModifier` + custom styles |
| `children` / composition | `@ViewBuilder` closures |
| localStorage | `UserDefaults` / `@AppStorage` |

### Networking

`URLSession` with `async/await`. No third-party networking library.

The API contract (verified from `packages/web/src/api/index.ts` and `packages/web/src/utils/api.ts`):
- Base URL: `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1`
- Headers: `Authorization: Bearer <token>`, `X-Project-ID: <id>`, `Content-Type: application/json`
- Fallback project ID: `legacy-shared-project`
- Methods: GET (list), PUT (create), POST `/{id}` (update), DELETE `/{id}` (delete)

### Auth

`ASWebAuthenticationSession` (built-in iOS) for Cognito OIDC login. Tokens stored in Keychain.

OIDC config (from `packages/web/src/config/oidc.ts`):
- Authority: `https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_G0ND9mzC2`
- Client ID: `tr2fu38tohgm19h4lr6dqomc3`
- Scopes: `email openid profile`
- Response type: `code` (PKCE flow)

**Infra changes required** in `packages/infra/modules/cognito/main.tf`:
- Add `kairos://auth/callback` to `callback_urls` (line ~94)
- Add `kairos://` to `logout_urls` (line ~99)

### Data Layer

**In-memory caching** (not SwiftData). The web app uses React Query with in-memory caches and optimistic updates — no persistent offline database. Each store holds data as arrays, fetched on launch/foreground, updated optimistically on mutations. If offline persistence is needed later, SwiftData can be layered underneath without changing the view layer.

### Navigation

```
TabView (5 tabs)
├── Home (NavigationStack)
│   └── Dashboard → drill-down to any domain
├── Shops (NavigationStack)
│   ├── Shop list
│   ├── Grocery list (per shop)
│   └── Add/Edit grocery item
├── Add (center button → sheet/action sheet)
│   └── Quick-add: todo, grocery, recipe, etc.
├── Recipes (NavigationStack)
│   ├── Recipe list (search + filter)
│   └── Recipe detail / edit
└── Planner (NavigationStack)
    ├── Calendar / Weekly / Grouped views
    └── Add/Edit planner item

Presented as sheets:
- User Menu / Settings
- Adventures, Birthdays, Noise, Office (from Home)
- Project switching
```

### Dependency Injection

Constructor injection for stores, `.environment()` for views:

```swift
@main
struct KairosApp: App {
    @State private var container = DependencyContainer()
    
    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(container.authStore)
                .environment(container.projectStore)
                // ... all stores
        }
    }
}
```

`DependencyContainer` creates `APIClient` → `AuthStore` → `ProjectStore` → domain stores in dependency order.

### SPM Dependencies

- `KeychainAccess` — secure token storage
- No other third-party dependencies. URLSession, `@Observable`, `ASWebAuthenticationSession`, and native SwiftUI cover everything.

---

## Project Structure

```
packages/ios/
├── Kairos/
│   ├── Kairos.xcodeproj
│   ├── Kairos/
│   │   ├── App/
│   │   │   ├── KairosApp.swift               # @main entry point
│   │   │   ├── DependencyContainer.swift      # Wires stores + services
│   │   │   └── ContentView.swift              # Auth gate + TabView
│   │   │
│   │   ├── Models/                            # Codable structs (from @kairos/shared)
│   │   │   ├── Adventure.swift
│   │   │   ├── Birthday.swift
│   │   │   ├── GroceryItem.swift
│   │   │   ├── MealPlan.swift
│   │   │   ├── NoiseTrackingItem.swift
│   │   │   ├── OfficeAttendance.swift
│   │   │   ├── Project.swift
│   │   │   ├── ProjectMember.swift
│   │   │   ├── Recipe.swift
│   │   │   ├── Shop.swift
│   │   │   ├── TodoItem.swift
│   │   │   └── UserPreferences.swift
│   │   │
│   │   ├── Enums/
│   │   │   ├── GroceryCategory.swift          # Web-only enum, port from web
│   │   │   ├── GroceryItemUnit.swift          # From @kairos/shared
│   │   │   ├── GroceryViewMode.swift          # Web-only enum
│   │   │   ├── MealType.swift                 # From @kairos/shared
│   │   │   ├── PlannerViewMode.swift          # Web-only enum
│   │   │   ├── ProjectRole.swift              # From @kairos/shared
│   │   │   ├── RecipeDishType.swift           # From @kairos/shared
│   │   │   └── AppError.swift
│   │   │
│   │   ├── Networking/
│   │   │   ├── APIClient.swift                # Protocol + URLSession implementation
│   │   │   ├── Endpoint.swift                 # All API paths (from ApiEndpoint enum)
│   │   │   └── APIError.swift
│   │   │
│   │   ├── Auth/
│   │   │   ├── AuthStore.swift                # OIDC login/logout/refresh
│   │   │   ├── KeychainService.swift          # Token storage
│   │   │   └── OIDCConfiguration.swift        # Cognito constants
│   │   │
│   │   ├── Stores/
│   │   │   ├── ProjectStore.swift
│   │   │   ├── AppStateStore.swift            # Alerts, UI ephemeral state
│   │   │   ├── ShopStore.swift
│   │   │   ├── GroceryStore.swift
│   │   │   ├── PlannerStore.swift
│   │   │   ├── RecipeStore.swift
│   │   │   ├── MealPlanStore.swift
│   │   │   ├── AdventureStore.swift
│   │   │   ├── BirthdayStore.swift
│   │   │   ├── NoiseTrackingStore.swift
│   │   │   ├── OfficeAttendanceStore.swift
│   │   │   └── ProjectMembersStore.swift
│   │   │
│   │   ├── Views/
│   │   │   ├── Home/
│   │   │   │   ├── HomeView.swift
│   │   │   │   ├── HomeGrocerySection.swift
│   │   │   │   ├── HomeTodoSection.swift
│   │   │   │   ├── HomeNoiseSection.swift
│   │   │   │   ├── HomeBirthdaySection.swift
│   │   │   │   ├── HomeAdventureSection.swift
│   │   │   │   └── HomeMealPlanSection.swift
│   │   │   ├── Shops/
│   │   │   │   ├── ShopListView.swift
│   │   │   │   ├── ShopRowView.swift
│   │   │   │   ├── AddShopSheet.swift
│   │   │   │   └── EditShopSheet.swift
│   │   │   ├── Grocery/
│   │   │   │   ├── GroceryListView.swift
│   │   │   │   ├── GroceryItemRow.swift
│   │   │   │   ├── GroceryCategorySection.swift
│   │   │   │   ├── AddGroceryItemView.swift
│   │   │   │   ├── EditGroceryItemView.swift
│   │   │   │   └── GroceryViewModePicker.swift
│   │   │   ├── Planner/
│   │   │   │   ├── PlannerView.swift
│   │   │   │   ├── PlannerCalendarView.swift
│   │   │   │   ├── PlannerWeeklyView.swift
│   │   │   │   ├── PlannerGroupedView.swift
│   │   │   │   ├── AddTodoItemView.swift
│   │   │   │   ├── EditTodoItemView.swift
│   │   │   │   ├── TodoItemRow.swift
│   │   │   │   └── TodoStepRow.swift
│   │   │   ├── Recipes/
│   │   │   │   ├── RecipeListView.swift
│   │   │   │   ├── RecipeCard.swift
│   │   │   │   ├── RecipeDetailView.swift
│   │   │   │   ├── AddRecipeView.swift
│   │   │   │   ├── EditRecipeView.swift
│   │   │   │   └── RecipeFilterSheet.swift
│   │   │   ├── MealPlans/
│   │   │   │   └── AddMealPlanSheet.swift
│   │   │   ├── Adventures/
│   │   │   │   ├── AdventureListView.swift
│   │   │   │   ├── AddAdventureView.swift
│   │   │   │   └── EditAdventureView.swift
│   │   │   ├── Birthdays/
│   │   │   │   ├── BirthdayListView.swift
│   │   │   │   └── AddBirthdaySheet.swift
│   │   │   ├── NoiseTracking/
│   │   │   │   ├── NoiseTrackingView.swift
│   │   │   │   └── NoiseStatsView.swift
│   │   │   ├── OfficeAttendance/
│   │   │   │   └── OfficeAttendanceView.swift
│   │   │   ├── Settings/
│   │   │   │   ├── UserMenuView.swift
│   │   │   │   ├── ProjectSettingsView.swift
│   │   │   │   ├── ProjectSwitcherView.swift
│   │   │   │   ├── MemberListView.swift
│   │   │   │   └── NotificationSettingsView.swift
│   │   │   ├── Auth/
│   │   │   │   └── LoginView.swift
│   │   │   └── Shared/
│   │   │       ├── LoadingView.swift
│   │   │       ├── ErrorView.swift
│   │   │       ├── EmptyStateView.swift
│   │   │       ├── AsyncS3Image.swift         # S3 image loading
│   │   │       ├── SwipeActionRow.swift        # Reusable swipe-to-delete/edit
│   │   │       ├── SearchBar.swift
│   │   │       └── AlertBanner.swift
│   │   │
│   │   ├── Utilities/
│   │   │   ├── DateFormatting.swift
│   │   │   ├── CategoryMatcher.swift          # Port from web
│   │   │   └── HapticFeedback.swift
│   │   │
│   │   └── Resources/
│   │       ├── Assets.xcassets                # App icon, colors, images
│   │       └── Info.plist
│   │
│   └── KairosTests/
│       ├── Stores/
│       │   ├── ShopStoreTests.swift
│       │   ├── GroceryStoreTests.swift
│       │   ├── PlannerStoreTests.swift
│       │   ├── RecipeStoreTests.swift
│       │   └── ... (one per store)
│       ├── Networking/
│       │   ├── APIClientTests.swift
│       │   └── EndpointTests.swift
│       ├── Auth/
│       │   └── AuthStoreTests.swift
│       ├── Utilities/
│       │   └── CategoryMatcherTests.swift
│       └── Mocks/
│           ├── MockAPIClient.swift
│           └── MockAuthStore.swift
```

---

## Model Layer

All models are `Codable` + `Identifiable` + `Sendable` structs. Field names match the JSON wire format exactly (camelCase, so default `CodingKeys` work).

**Source of truth for types**: `packages/shared/types/` and `packages/shared/enums/`

### Verified Type Definitions

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
    var visibility: String?    // "private" or nil (see isPrivate mapping in API Patterns)
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

### Verified Enum Definitions

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

---

## API Endpoints

Source: `packages/infra/modules/api_gateway/openapi/*.yml` and `packages/web/src/api/*/index.ts`.

### Header Construction

```swift
// Project-scoped requests (most domain endpoints)
"Authorization": "Bearer \(idToken)"
"X-Project-ID": projectId    // from ProjectStore.currentProject.id
"Content-Type": "application/json"

// User-scoped requests (projects, preferences, push subscriptions, grocery defaults)
"Authorization": "Bearer \(accessToken)"
"Content-Type": "application/json"
// NO X-Project-ID header
```

### Endpoint Reference

#### Shops
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/shops` | — | `[Shop]` | Project-scoped |
| PUT | `/shops` | `{ name, icon? }` | `{ id }` | |
| PATCH | `/shops/{id}` | `{ id, name?, icon? }` | `Shop` | **PATCH not POST** |
| DELETE | `/shops/{id}` | — | 200 | |
| GET | `/shops/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | Pre-signed S3 URL |

#### Grocery Items (batch operations)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/grocery_list/items` | — | `[GroceryItem]` | `?shopId=` optional filter. Project-scoped |
| PUT | `/grocery_list/items` | `{ items: [GroceryItem], isPrivate?: true }` | `{ items: [{ id }] }` | **BATCH add (max 25)**. `quantity` is a **String** on the wire |
| PATCH | `/grocery_list/items/{id}` | `{ id, name?, quantity?, unit?, shopId?, imagePath?, isPrivate? }` | `GroceryItem` | Single item update |
| DELETE | `/grocery_list/items/{id}` | — | 200 | Single item delete |

#### Grocery Item Defaults (user-scoped, NO X-Project-ID)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/grocery_list/items_defaults` | — | `[GroceryItemDefault]` | User-scoped |
| POST | `/grocery_list/items_defaults` | `{ name, unit?, icon?, category? }` | 201 | |
| PATCH | `/grocery_list/items_defaults/{name}` | `{ icon?, unit?, category? }` | 200 | Keyed by **name** not id |
| DELETE | `/grocery_list/items_defaults/{name}` | — | 200 | |
| GET | `/grocery_list/items_defaults/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | |

#### To-Do Items (supports batch update)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/todo_list/items` | — | `[TodoItem]` | Project-scoped |
| PUT | `/todo_list/items` | `{ name, description?, dueDate?, isDone? }` | 201 | Single create |
| PATCH | `/todo_list/items/{id}` | `{ id, name?, description?, dueDate?, isDone? }` | `TodoItem` | Single update |
| POST | `/todo_list/items` | `{ items: [{ id, isDone }] }` | `[TodoItem]` | **BATCH toggle isDone** |
| DELETE | `/todo_list/items` | `{ items: [TodoItem] }` | 200 | |

#### Recipes
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/recipes` | — | `[Recipe]` | Project-scoped |
| PUT | `/recipes` | `{ name, ingredients, instructions?, imagePath?, mealTypes?, dishTypes? }` | `{ id }` | |
| POST | `/recipes/{id}` | `{ id, name?, ingredients?, instructions?, imagePath?, mealTypes?, dishTypes? }` | 200 | |
| DELETE | `/recipes/{id}` | — | 200 | |
| GET | `/recipes/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | |

#### Meal Plans
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/meal-plans` | — | `[MealPlan]` | Project-scoped |
| PUT | `/meal-plans` | `{ date, recipeName, recipeId?, imagePath? }` | `{ id }` | |
| POST | `/meal-plans/{id}` | `{ id, date?, recipeName?, recipeId?, mealType?, imagePath? }` | 200 | |
| DELETE | `/meal-plans/{id}` | — | 200 | |
| GET | `/meal-plans/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | |

#### Adventures
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/adventures` | — | `[Adventure]` | Project-scoped |
| PUT | `/adventures` | `{ name, date, endDate?, time?, location?, notes?, imagePath? }` | `{ id }` | |
| POST | `/adventures/{id}` | `{ id, name?, date?, endDate?, time?, location?, notes?, imagePath? }` | 200 | |
| DELETE | `/adventures/{id}` | — | 200 | |
| GET | `/adventures/upload-url?extension=jpg` | — | `{ uploadUrl, imagePath }` | |

#### Birthdays
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/birthdays/items` | — | `[Birthday]` | Project-scoped |
| PUT | `/birthdays/items` | `{ name, month, day, birthYear?, notes? }` | 201 | |
| PATCH | `/birthdays/items/{id}` | `{ id, name?, month?, day?, birthYear?, notes? }` | 200 | **PATCH not POST** |
| DELETE | `/birthdays/items/{id}` | — | 200 | |

#### Noise Tracking
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/noise_tracking/items` | — | `[NoiseTrackingItem]` | Project-scoped. Note: **underscores** |
| PUT | `/noise_tracking/items` | `{ timestamp }` | 201 | timestamp = Unix ms |
| DELETE | `/noise_tracking/items/{timestamp}` | — | 200 | Path param is **timestamp (number)** not id |

#### Office Attendance
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/office-attendance` | — | `[OfficeAttendance]` | Project-scoped |
| PUT | `/office-attendance` | `{ date, userId, userName, userAvatar? }` | `{ id }` | |
| DELETE | `/office-attendance/{id}` | — | 200 | |

#### Projects (user-scoped, NO X-Project-ID except members)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/projects` | — | `[Project]` | User-scoped |
| POST | `/projects` | `{ name, isPersonal? }` | `ProjectWithRole` | Create project |
| POST | `/projects/join` | `{ inviteCode }` | `ProjectWithRole` | 6-char uppercase alphanumeric |
| GET | `/projects/invite/{inviteCode}` | — | `ProjectInviteInfo` | **Public, no auth required** |
| GET | `/projects/members` | — | `[ProjectMember]` | **Requires X-Project-ID** |
| DELETE | `/projects/members` | — | 200 | Leave project. Requires X-Project-ID |
| DELETE | `/projects/members/{userId}` | — | 200 | Remove member (owner only). Requires X-Project-ID |

#### User Preferences (user-scoped, NO X-Project-ID)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| GET | `/user/preferences` | — | `UserPreferences` | |
| PUT | `/user/preferences` | `{ currentProjectId? }` | `UserPreferences` | |

#### Push Subscriptions (user-scoped, uses accessToken)
| Method | Path | Body | Response | Notes |
|--------|------|------|----------|-------|
| POST | `/push-subscriptions` | `{ endpoint, keys: { p256dh, auth } }` | `{ success }` | VAPID web push |
| DELETE | `/push-subscriptions?endpoint={urlEncoded}` | — | `{ success }` | |

### Key API Patterns

1. **PATCH vs POST for updates**: Shops, grocery items, todo items, and birthdays use `PATCH`. Adventures, recipes, and meal plans use `POST`. Always check the table above.
2. **Batch operations**: Grocery PUT accepts `{ items: [...] }` (max 25). Todo POST accepts `{ items: [{ id, isDone }] }` for bulk toggle.
3. **`isPrivate` → `visibility` mapping**: Create/update requests send `isPrivate: true`. The backend stores `visibility: "private"`. When reading, check `visibility === "private"`.
4. **`quantity` is a String on the wire**: The API sends/receives grocery item `quantity` as a `String` (e.g., `"5"`). Convert to/from `Double` in the Swift model using custom `Codable`.
5. **Upload URLs**: GET `/{resource}/upload-url?extension=jpg` returns `{ uploadUrl, imagePath }`. PUT the file bytes directly to `uploadUrl`. Store `imagePath` on the entity.
6. **Noise tracking**: Delete uses `{timestamp}` (Unix ms number) as path param, not `{id}`.

---

## Cross-Cutting Concerns

These patterns apply across ALL phases. Every agent must follow them for consistency.

### Auth Token Injection

The `APIClient` must support two calling modes:

1. **Project-scoped** (most domain endpoints): sends `Authorization: Bearer <idToken>` + `X-Project-ID` headers
2. **User-scoped** (projects, preferences, push subscriptions, grocery defaults): sends `Authorization: Bearer <accessToken>` only, NO `X-Project-ID`

```swift
protocol APIClient: Sendable {
    func get<T: Decodable>(endpoint: Endpoint, projectScoped: Bool) async throws -> T
    func put<T: Decodable>(endpoint: Endpoint, body: Encodable, projectScoped: Bool) async throws -> T
    func post<T: Decodable>(endpoint: Endpoint, body: Encodable, projectScoped: Bool) async throws -> T
    func patch<T: Decodable>(endpoint: Endpoint, body: Encodable, projectScoped: Bool) async throws -> T
    func delete(endpoint: Endpoint, projectScoped: Bool) async throws
}
```

The `APIClient` implementation should:
- Get tokens from `AuthStore` (which stores them in Keychain)
- Default `projectScoped: true` for most calls
- Get `projectId` from `ProjectStore.currentProject.id`

### Token Refresh Flow

The web app uses OIDC automatic silent renewal:
- `automaticSilentRenew: true`
- `accessTokenExpiringNotificationTimeInSeconds: 300` (5-min warning)
- Token refresh triggered on: app startup (if session exists), visibility change (app foregrounded)

**iOS equivalent**: On `AuthStore`:
- Attempt `signinSilent()` equivalent on app launch if Keychain has tokens
- Refresh tokens on `scenePhase` change to `.active` (replaces `visibilitychange`)
- No explicit 401 retry logic — the web app doesn't have one either. If a token expires mid-session, the next foreground event refreshes it.

### Error Handling Pattern

Every store must expose:

```swift
@Observable
class SomeStore {
    var isLoading: Bool = false
    var isError: Bool = false
    // ...
}
```

**Rules:**
- Set `isLoading = true` before fetch, `false` after (regardless of success/failure)
- Set `isError = true` on fetch failure, `false` on next successful fetch
- Log errors with `print()` or `os_log` (the web app uses `console.error()` in a useEffect)
- Mutation errors (add/update/delete): throw the error so the calling view can handle it (show alert)
- No structured error parsing — just boolean flag + thrown errors
- Status 409 on shop creation means duplicate name — surface as user-facing message

### Loading State Convention

Every store that fetches data must expose `isLoading: Bool`. Views should:
- Show `LoadingView()` when `store.isLoading && store.items.isEmpty` (first load only)
- Show inline `.refreshable {}` spinner on subsequent refreshes
- Never show a full-screen loader when data is already cached

### Update-After-Success Pattern

**This is NOT optimistic updates.** The web app calls the API first, then updates the local cache on success:

```swift
func addShop(name: String) async throws {
    let response = try await apiClient.put(endpoint: .shops, body: CreateShopRequest(name: name))
    // Only update local state AFTER API succeeds
    let newShop = Shop(id: response.id, projectId: projectStore.currentProjectId, name: name, ...)
    shops.append(newShop)
}
```

- **Create**: API call → append to local array
- **Update**: API call → find and replace in local array
- **Delete**: API call → filter out from local array
- **On failure**: throw error, local state unchanged. No rollback needed.

### `isPrivate` ↔ `visibility` Mapping

- **Create/update requests**: send `isPrivate: true` in the request body to mark as private
- **Read responses**: items have `visibility: "private"` (or nil/absent for shared)
- **Display logic**: check `item.visibility == "private"` to determine if item is private
- **UI**: private items should show a lock icon or similar indicator

### Date Format Conventions

| Field | Format | Example |
|-------|--------|---------|
| `createdAt`, `updatedAt` | ISO 8601 string | `"2026-03-15T10:30:00.000Z"` |
| `dueDate` (TodoItem) | Unix timestamp in **milliseconds** (Int) | `1710500000000` |
| `timestamp` (NoiseTracking) | Unix timestamp in **milliseconds** (Int) | `1710500000000` |
| `date` (Adventure, MealPlan, OfficeAttendance) | ISO date string | `"2026-03-15"` |
| `time`, `endTime` (Adventure) | Time string | `"14:30"` |
| `month`, `day` (Birthday) | Int | `3`, `15` |

Use `ISO8601DateFormatter` for ISO strings. Use `Date(timeIntervalSince1970: timestamp / 1000)` for Unix ms timestamps.

### AppState Ephemeral UI State

`AppStateStore` manages session-local UI state that is NOT persisted to the backend:

```swift
@Observable
class AppStateStore {
    var alerts: [String: Alert] = [:]              // Toast notifications (key = unique ID)
    var purchasedItems: Set<String> = []           // Grocery items "checked off" during shopping
    var selectedTodoItems: Set<String> = []        // Multi-selected todo items (for batch toggle)
    var selectedCalendarDate: String? = nil         // Currently highlighted date in planner calendar
}
```

**`purchasedItems`** is critical for the grocery shopping UX: when a user taps a grocery item in the list, its ID is added to this set. The item appears struck-through but is NOT deleted from the backend. Clearing purchased items is a separate action.

---

## Implementation Phases

### Phase Dependency Graph

```
Phase 0 (Scaffold)
  └── Phase 1 (Auth + Networking)
        └── Phase 2 (Projects + Core Wiring)
              ├── Phase 3a (Shared Views)  ──────────────────────┐
              │     └── Phase 3b (Shops)                         │
              │           └── Phase 3c (Grocery Store + Views)   │
              │                 └── Phase 3d (Grocery Forms)     │
              ├── Phase 4 (Planner / To-Do)  ←── needs 3a       │
              ├── Phase 5 (Recipes + Meal Plans)  ←── needs 3a   │
              ├── Phase 7a (Adventures)  ←── needs 3a            │
              ├── Phase 7b (Birthdays)  ←── needs 3a             │
              ├── Phase 7c (Noise Tracking)  ←── needs 3a        │
              ├── Phase 7d (Office Attendance)  ←── needs 3a     │
              ├── Phase 8a (Project Members)                     │
              └── Phase 9 (Push Notifications)                   │
                                                                 │
Phase 6 (Home Dashboard) ←── needs 3b, 4, 5, 7a-d ─────────────┘
Phase 8b (Polish) ←── needs all above
Phase 10 (App Store) ←── needs all above
```

**Parallelizable after Phase 3a completes**: Phases 3b, 4, 5, 7a, 7b, 7c, 7d, 8a, 9 can all run in parallel.

**Shared file bottleneck**: `DependencyContainer.swift` and `KairosApp.swift` must be updated by every phase that adds a store. See "Shared File Coordination" section below for the merge pattern.

---

### Phase 0: Project Scaffold
**Goal**: Empty app builds and runs on simulator.

- Create Xcode project at `packages/ios/Kairos/`
- iOS 17 minimum deployment target
- Add `KeychainAccess` via SPM
- Basic `KairosApp.swift` → empty `ContentView`
- Add `.gitignore` for Swift artifacts (`*.xcuserdata`, `.build/`, `DerivedData/`)
- Add `packages/ios/` to root `.prettierignore`
- Verify build + empty test suite passes

**Acceptance criteria**: `xcodebuild build` succeeds with zero warnings. `xcodebuild test` runs and passes (empty suite). App launches on iOS 17 simulator showing a blank screen.

### Phase 1: Auth + Networking
**Goal**: User can log in via Google, see empty tab bar, log out.

- **Models**: All `Codable` structs and enums (pure data, no dependencies)
- **Networking**: `APIClient` protocol + URLSession implementation with both project-scoped and user-scoped modes (see Cross-Cutting Concerns), `Endpoint` enum covering all paths from the API Endpoints table
- **Auth**: `AuthStore` with `ASWebAuthenticationSession`, `KeychainService`, token refresh on foreground
- **Views**: `LoginView`, `ContentView` (auth gate → TabView skeleton with 5 empty tabs)
- **Infra change**: Add `kairos://auth/callback` to `callback_urls` AND `kairos://` to `logout_urls` in `packages/infra/modules/cognito/main.tf`
- **Tests**: `APIClientTests` (URL construction, header injection for both scoped modes, error handling), `EndpointTests` (all path strings match API table), `AuthStoreTests` (login flow, token persistence, refresh)

**Acceptance criteria**: User taps Login → Google sign-in sheet appears → completes OIDC flow → lands on TabView with 5 tabs. Kill and relaunch app → session restored from Keychain (no re-login). Tap Logout → returns to LoginView, tokens cleared from Keychain. All tests pass.

### Phase 2: Projects + Core Wiring
**Goal**: User can see/switch projects and access user menu.

- **Stores**: `ProjectStore` (fetch projects, switch active project, user preferences with `currentProjectId`), `AppStateStore` (alerts, purchasedItems, selectedTodoItems, selectedCalendarDate — see Cross-Cutting Concerns)
- **DI**: `DependencyContainer` wiring `AuthStore`, `ProjectStore`, `AppStateStore`. See "Shared File Coordination" for the pattern other phases must follow.
- **Views**: `ProjectSwitcherView` (list projects, tap to switch), `UserMenuView` (project info, switch project, logout button)
- **Tests**: `ProjectStoreTests` (fetch projects, switch project updates preferences, user-scoped API calls have no X-Project-ID)

**Acceptance criteria**: After login, app fetches user's projects and sets the active project. User menu shows current project name. Switching projects updates `UserPreferences.currentProjectId` via API. Subsequent domain fetches use the new project ID. All tests pass.

### Phase 3: Shops + Grocery Lists

Split into 4 sub-phases for parallelization. **3a must complete before 3b-3d and before any other domain phase.**

#### Phase 3a: Shared Views (PREREQUISITE for all domain phases)
**Goal**: Reusable view components available for all domain phases.

- `LoadingView`, `ErrorView`, `EmptyStateView` — standard states used by every domain
- `SwipeActionRow` — reusable swipe-to-delete/edit row (wraps `.swipeActions`)
- `AsyncS3Image` — loads images from S3 `imagePath`
- `SearchBar` — reusable search input
- `AlertBanner` — toast notification display driven by `AppStateStore.alerts`
- `HapticFeedback` utility

**Acceptance criteria**: Each shared view renders correctly in Xcode previews. No domain-specific logic — purely presentational. All views accept configuration via parameters.

#### Phase 3b: Shops
**Goal**: User can manage shops (CRUD).

- **Store**: `ShopStore` (follows EntityStore protocol pattern, uses `PATCH` for updates)
- **Views**: `ShopListView`, `ShopRowView`, `AddShopSheet`, `EditShopSheet`
- **Tests**: `ShopStoreTests`
- **Note**: Shop update uses `PATCH /shops/{id}`, not POST. Status 409 = duplicate name.

**Acceptance criteria**: User sees list of shops sorted by name. Can add a shop (name + optional icon). Can edit shop name/icon via swipe action. Can delete shop via swipe action. Pull-to-refresh reloads from API. Empty state shown when no shops. All tests pass.

#### Phase 3c: Grocery Store + List Views
**Goal**: Grocery list display with 3 view modes.

- **Store**: `GroceryStore` (batch add via `PUT { items: [...] }`, single update via `PATCH`, `quantity` is String on wire)
- **Views**: `GroceryListView` (3 view modes: categorized, alphabetical, uncategorized), `GroceryItemRow` (with swipe actions + tap to toggle `purchasedItems` in `AppStateStore`), `GroceryCategorySection`, `GroceryViewModePicker`
- **Utilities**: `CategoryMatcher` (port from `packages/web/src/utils/grocery/categoryMatcher.ts`)
- **Tests**: `GroceryStoreTests`, `CategoryMatcherTests`
- **Note**: Purchased items are tracked in `AppStateStore.purchasedItems` (ephemeral, not persisted)

**Acceptance criteria**: Navigate from shop to its grocery list. Items grouped by category (categorized mode), alphabetical, or flat. Tap item → struck-through (added to purchasedItems). Swipe to delete. View mode picker switches between 3 modes. Pull-to-refresh. All tests pass.

#### Phase 3d: Grocery Item Forms
**Goal**: Add and edit grocery items.

- **Views**: `AddGroceryItemView` (quantity picker, unit selector, category, shop assignment), `EditGroceryItemView`
- **Integration**: Uses `GroceryItemDefault` for autocomplete suggestions (fetched from user-scoped defaults endpoint)

**Acceptance criteria**: Add form shows name, quantity (numeric input), unit (picker from `GroceryItemUnit`), category. Autocomplete from defaults works. Edit form pre-fills existing values. Submit calls appropriate API. New item appears in list without manual refresh.

### Phase 4: Planner / To-Do
**Goal**: Full task management with 3 view modes. **Depends on**: Phase 3a (shared views).

- **Store**: `PlannerStore` (single update via `PATCH`, batch isDone toggle via `POST { items: [...] }`, uses `selectedTodoItems` and `selectedCalendarDate` from `AppStateStore`)
- **Views**: `PlannerView` (segmented control for 3 modes), `PlannerCalendarView` (highlights dates with items, tapping date sets `selectedCalendarDate`), `PlannerWeeklyView` (groups by week), `PlannerGroupedView` (separates done/undone), `TodoItemRow` (with steps expansion), `TodoStepRow`, `AddTodoItemView` (name, description, due date picker), `EditTodoItemView`
- **Tests**: `PlannerStoreTests` (CRUD, batch toggle, date filtering)
- **Note**: `dueDate` is Unix timestamp in milliseconds. Batch toggle uses `POST /todo_list/items` with `{ items: [{ id, isDone }] }`.

**Acceptance criteria**: Planner shows 3 view modes via segmented control. Calendar view highlights dates that have items; tapping a date shows that day's items. Weekly view groups items by week. Grouped view separates done/undone. Can add/edit/delete items. Swipe to delete. Tap checkbox toggles isDone (batch toggle for multi-select). Steps expand inline. All tests pass.

### Phase 5: Recipes + Meal Plans
**Goal**: Recipe library and meal planning. **Depends on**: Phase 3a (shared views).

- **Stores**: `RecipeStore` (follows EntityStore protocol, update via `POST`), `MealPlanStore` (follows EntityStore protocol, update via `POST`)
- **Views**: `RecipeListView` (search by name + filter by mealType/dishType), `RecipeCard`, `RecipeDetailView` (ingredients list, instructions, external link), `AddRecipeView` (ingredient builder with name/quantity/unit), `EditRecipeView`, `RecipeFilterSheet` (multi-select mealType + dishType), `AddMealPlanSheet` (date picker, recipe selector, meal type)
- **Features**: Image upload via pre-signed S3 URL (`GET /recipes/upload-url?extension=jpg` → PUT bytes to `uploadUrl` → save `imagePath`)
- **Tests**: `RecipeStoreTests`, `MealPlanStoreTests`

**Acceptance criteria**: Recipe list shows cards with images. Search filters by name. Filter sheet narrows by meal type and dish type. Recipe detail shows ingredients, instructions, external link. Can add recipe with ingredient builder (add/remove rows). Image upload works (pick photo → upload → display). Meal plan sheet lets user pick date + recipe + meal type. All tests pass.

### Phase 6: Home Dashboard
**Goal**: Aggregated dashboard with all domain data. **Depends on**: Phases 3b, 4, 5, 7a-d (all domain stores must exist).

- **Views**: `HomeView`, `HomeGrocerySection` (pending items count per shop), `HomeTodoSection` (overdue + upcoming), `HomeNoiseSection` (recent count + stats), `HomeBirthdaySection` (upcoming birthdays), `HomeAdventureSection` (upcoming adventures), `HomeMealPlanSection` (today's meals)
- **Logic**: Port `useHomeData` aggregation from `packages/web/src/hooks/useHomeData/index.ts` — pending item counts, upcoming items, stats
- **Note**: Each section reads from its domain store (injected via `.environment()`). Sections should gracefully handle empty data. Build sections incrementally as domain stores become available — if a domain phase is delayed, its home section can show empty state.

**Acceptance criteria**: Dashboard shows summary cards for each domain. Grocery section shows total pending items. Todo section shows overdue count. Birthday section shows next upcoming. Tapping a section navigates to its full domain view. All sections show empty states gracefully. Pull-to-refresh reloads all domains.

### Phase 7: Secondary Domains

Split into 4 independent sub-phases that can run fully in parallel. Each depends only on Phase 3a (shared views).

#### Phase 7a: Adventures
**Goal**: Adventure CRUD with image upload. **Depends on**: Phase 3a.

- **Store**: `AdventureStore` (follows EntityStore protocol, update via `POST`, image upload via `/adventures/upload-url`)
- **Views**: `AdventureListView` (sorted by date), `AddAdventureView` (name, date range, time range, location, notes, image), `EditAdventureView`
- **Tests**: `AdventureStoreTests`

**Acceptance criteria**: List shows adventures sorted by date. Can add/edit/delete. Date/time pickers work. Image upload works. Swipe to delete. All tests pass.

#### Phase 7b: Birthdays
**Goal**: Birthday CRUD. **Depends on**: Phase 3a.

- **Store**: `BirthdayStore` (follows EntityStore protocol, update via `PATCH`)
- **Views**: `BirthdayListView` (sorted by upcoming), `AddBirthdaySheet` (name, month, day, optional birth year, notes)
- **Tests**: `BirthdayStoreTests`
- **Note**: Update uses `PATCH /birthdays/items/{id}`, not POST.

**Acceptance criteria**: List shows birthdays sorted by upcoming date. Age calculated from birthYear if provided. Can add/edit/delete. All tests pass.

#### Phase 7c: Noise Tracking
**Goal**: Noise event logging with stats. **Depends on**: Phase 3a.

- **Store**: `NoiseTrackingStore` (add sends `{ timestamp }`, delete path is `/noise_tracking/items/{timestamp}` — uses timestamp as identifier, NOT id)
- **Views**: `NoiseTrackingView` (log button + event list), `NoiseStatsView` (frequency charts/stats)
- **Tests**: `NoiseTrackingStoreTests`
- **Note**: Path uses **underscores** (`noise_tracking`). Delete uses `{timestamp}` (number) as path param.

**Acceptance criteria**: User taps button to log noise event (creates item with current Unix ms timestamp). List shows events in reverse chronological order. Stats view shows frequency data. Can delete events. All tests pass.

#### Phase 7d: Office Attendance
**Goal**: Office day tracking. **Depends on**: Phase 3a.

- **Store**: `OfficeAttendanceStore` (create-only + delete, no update endpoint)
- **Views**: `OfficeAttendanceView` (calendar marking office days, quick-add for today)
- **Tests**: `OfficeAttendanceStoreTests`

**Acceptance criteria**: Calendar shows office days marked. Can add attendance for a date. Can delete attendance. Shows who else is in the office (from project members). All tests pass.

### Phase 8: Project Members + Polish

Split into 2 independent sub-phases.

#### Phase 8a: Project Members
**Goal**: Project member management and join/create flows. **Depends on**: Phase 2.

- **Store**: `ProjectMembersStore` (GET members requires X-Project-ID, remove member via `DELETE /projects/members/{userId}`)
- **Views**: `MemberListView` (shows member name, avatar, role), `ProjectSettingsView` (project name, invite code sharing via `ShareLink`), create project form (`POST /projects`), join project flow (`GET /projects/invite/{code}` for preview → `POST /projects/join`)
- **Models**: Uses `ProjectInviteInfo` for the join preview
- **Tests**: `ProjectMembersStoreTests`

**Acceptance criteria**: Member list shows all project members with roles. Owner can remove members. Invite code can be shared. User can create a new project. User can join a project by entering an invite code (shows preview first). All tests pass.

#### Phase 8b: Polish Pass (cross-cutting)
**Goal**: Feature-complete with polished UX. **Depends on**: ALL previous phases.

- Haptic feedback on: item completion (todo checked, grocery purchased), successful create/delete
- `.refreshable { }` on all list views (verify already present from domain phases)
- Empty states for all lists (verify `EmptyStateView` used consistently)
- Loading skeletons on first load (verify `LoadingView` used consistently)
- Error retry: tap-to-retry on `ErrorView` for all fetch failures
- `AlertBanner` overlay driven by `AppStateStore.alerts` for success/error toasts

**Acceptance criteria**: All lists have pull-to-refresh. All empty states show helpful messages. All first-load states show loading indicators. Error states show retry button. Haptic feedback fires on key interactions. Toast notifications appear for mutations.

### Phase 9: Push Notifications
**Goal**: Remote notifications working end-to-end. **Depends on**: Phase 1 (auth).

- Register for APNs, send device token to backend
- Handle incoming notifications
- Configure notification categories + actions
- Deep-link from notification tap to relevant screen
- **Note**: The current backend only supports VAPID web push subscriptions (`POST /push-subscriptions` with `{ endpoint, keys: { p256dh, auth } }`). APNs requires a **backend change** to accept device tokens and send via APNs instead of web push. This phase may require a new Lambda + API endpoint.

**Acceptance criteria**: App requests notification permission on first launch. Device token sent to backend. Incoming notifications display correctly. Tapping a notification navigates to the relevant screen (e.g., grocery list, planner). Notification settings view allows toggling categories.

### Phase 10: App Store Prep
**Goal**: App Store submission. **Depends on**: ALL previous phases.

- App icon, launch screen
- App Store screenshots + metadata
- Privacy policy
- Final QA pass
- TestFlight external testing → App Store submission

**Acceptance criteria**: App icon displays correctly at all sizes. Launch screen shows branding. All screenshots captured for required device sizes. Privacy policy URL configured. TestFlight build uploaded and external testers invited. No crashes in 48-hour TestFlight soak test.

---

## SwiftUI Patterns for Key Web Components

| Web Component | SwiftUI Equivalent |
|---|---|
| `SwipeableListItem` (swipe-left for actions) | `List` with `.swipeActions(edge: .trailing)` |
| `DraggableBottomDrawer` | `.sheet()` with `.presentationDetents([.medium, .large])` |
| `ScrollableContainer` + pull-to-refresh | `List` or `ScrollView` with `.refreshable { }` |
| `SegmentedControl` | `Picker` with `.pickerStyle(.segmented)` |
| `CollapsibleSection` | `DisclosureGroup` or `Section` with `isExpanded` binding |
| `NavigationBar` (bottom tabs) | `TabView` with `.tabItem { }` |
| `ModernPageHeader` | Custom `ViewModifier` with gradient background |
| `ItemForm` (generic form) | SwiftUI `Form` with `@State` + `@FocusState` |
| `ConfettiBurst` | Custom `Canvas` animation or SPM particle library |
| `AlertContainer` | `.alert()` or custom overlay with `AppStateStore.alerts` |
| `GroceryItemPreviewPopup` | `.popover()` or `.sheet()` |

---

## Testing Strategy

**Framework**: Swift Testing (`@Test`, `#expect`) — BDD style matching web app convention.

**What to test**:
- **Stores** (highest priority): Every fetch/add/update/delete method. Mock `APIClient` protocol.
- **APIClient**: URL construction, header injection, error handling. Mock `URLProtocol`.
- **Models**: JSON encoding/decoding round-trips against sample API responses.
- **Utilities**: `CategoryMatcher`, date formatting — pure function tests.

**Example**:
```swift
@Test("Given a shop store, when fetchShops is called, it should populate the shops array")
func fetchShopsPopulatesArray() async {
    let mockAPI = MockAPIClient()
    mockAPI.stubbedGetResult = [Shop(id: "1", projectId: "p1", name: "Tesco", ...)]
    let store = ShopStore(apiClient: mockAPI, projectStore: mockProjectStore)
    
    await store.fetchShops()
    
    #expect(store.shops.count == 1)
    #expect(store.shops[0].name == "Tesco")
}
```

**UI Tests**: Minimal, critical flows only (login, create shop → add item → swipe delete).

---

## EntityStore Protocol

Multiple stores (Recipe, Adventure, Birthday, MealPlan, etc.) follow the identical CRUD pattern from `packages/web/src/hooks/useEntityCrud/index.ts`. To prevent agents from independently inventing different patterns, all CRUD stores MUST conform to this protocol:

```swift
/// Protocol for stores that manage a collection of identifiable entities via REST CRUD.
/// Mirrors the useEntityCrud hook from the web app.
protocol EntityStore: Observable {
    associatedtype Entity: Codable & Identifiable & Sendable
    associatedtype CreateFields: Encodable
    associatedtype UpdateFields: Encodable

    var items: [Entity] { get set }
    var isLoading: Bool { get set }
    var isError: Bool { get set }

    /// Fetch all entities for the current project
    func fetch() async

    /// Create a new entity. Calls API, then appends to local items on success.
    func add(_ fields: CreateFields) async throws

    /// Update an entity by ID. Calls API, then replaces in local items on success.
    func update(id: String, fields: UpdateFields) async throws

    /// Delete an entity by ID. Calls API, then removes from local items on success.
    func remove(id: String) async throws
}
```

**Stores that DON'T fit this protocol** (handle them individually):
- `AuthStore` — no CRUD, manages OIDC flow
- `ProjectStore` — mixed user-scoped + project-scoped, handles switching
- `AppStateStore` — ephemeral UI state only, no API calls
- `GroceryStore` — batch operations, non-standard endpoints
- `NoiseTrackingStore` — no update endpoint, delete by timestamp
- `OfficeAttendanceStore` — no update endpoint

---

## Shared File Coordination

### The DependencyContainer Bottleneck

Every phase that adds a store must modify two files:
1. `DependencyContainer.swift` — add property + initialize in `init()`
2. `KairosApp.swift` (or `RootView`) — add `.environment()` injection

To minimize merge conflicts, follow this exact pattern when adding a new store:

```swift
// In DependencyContainer.swift — add ONE property + ONE init line per store:
@Observable
class DependencyContainer {
    let authStore: AuthStore
    let projectStore: ProjectStore
    let appStateStore: AppStateStore
    // Phase 3b adds:
    let shopStore: ShopStore
    // Phase 3c adds:
    let groceryStore: GroceryStore
    // Phase 4 adds:
    let plannerStore: PlannerStore
    // ... each phase appends here

    init() {
        let apiClient = URLSessionAPIClient()
        authStore = AuthStore(apiClient: apiClient)
        projectStore = ProjectStore(apiClient: apiClient, authStore: authStore)
        appStateStore = AppStateStore()
        // Phase 3b adds:
        shopStore = ShopStore(apiClient: apiClient, projectStore: projectStore)
        // Phase 3c adds:
        groceryStore = GroceryStore(apiClient: apiClient, projectStore: projectStore)
        // ... each phase appends here
    }
}
```

```swift
// In KairosApp.swift — add ONE .environment() line per store:
RootView()
    .environment(container.authStore)
    .environment(container.projectStore)
    .environment(container.appStateStore)
    // Phase 3b adds:
    .environment(container.shopStore)
    // ... each phase appends here
```

**Rule**: Always append at the end. Never reorder existing lines. This makes merge conflicts trivially resolvable.

---

## Critical Files to Reference During Implementation

| Purpose | File Path |
|---|---|
| Shared type definitions | `packages/shared/types/*.ts` |
| Shared enum definitions | `packages/shared/enums/*.ts` |
| Web-only enums (grocery, planner) | `packages/web/src/enums/*.ts` |
| API client factory pattern | `packages/web/src/api/index.ts` |
| API header construction | `packages/web/src/utils/api.ts` |
| OIDC configuration | `packages/web/src/config/oidc.ts` |
| Cognito Terraform (callback + logout URLs) | `packages/infra/modules/cognito/main.tf` (lines ~94-103) |
| Provider patterns (reference impl) | `packages/web/src/providers/ShopProvider/index.tsx` |
| Generic CRUD hook | `packages/web/src/hooks/useEntityCrud/index.ts` |
| Category matcher logic | `packages/web/src/utils/grocery/categoryMatcher.ts` |
| Grocery category grouping hook | `packages/web/src/hooks/useGroceryCategories/index.ts` |
| Home dashboard aggregation | `packages/web/src/hooks/useHomeData/index.ts` |
| Entity CRUD hook (reference pattern) | `packages/web/src/hooks/useEntityCrud/index.ts` |
| AppState (ephemeral UI state) | `packages/web/src/providers/AppStateProvider/index.tsx` |
| Grocery item defaults type | `packages/web/src/api/groceryList/retrieve/types.ts` |
| Project invite info type | `packages/web/src/types/project.ts` |

---

## Verification

After each phase:
1. Run `xcodebuild test` — all tests pass
2. Build and run on simulator — no crashes
3. Manual QA of the phase's features
4. Deploy to TestFlight for device testing
