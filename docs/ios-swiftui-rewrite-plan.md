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

**One infra change required**: Add `kairos://auth/callback` to `callback_urls` in `packages/infra/modules/cognito/main.tf:94`.

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
struct GroceryItem: Codable, Identifiable, Sendable {
    let id: String
    var name: String
    var quantity: Double
    var unit: GroceryItemUnit
    var shopId: String
    var imagePath: String?
    var category: String?
    var visibility: String?
    var ownerId: String?
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
enum RecipeDishType: String, Codable, CaseIterable, Sendable {
    case pasta, soup, salad
    case bakedGoods = "baked_goods"
    case rice, stew
    case stirFry = "stir_fry"
    case sandwich
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

From `packages/web/src/enums/apiResource.ts` and provider analysis:

| Domain | Base Path | GET | PUT (create) | POST /{id} (update) | DELETE /{id} |
|---|---|---|---|---|---|
| Shops | `/shops` | List shops | Create shop | Update shop | Delete shop |
| Grocery | `/grocery_list` | List items (`?shopId=`) | Add item | Update item | Delete item |
| Grocery Defaults | `/grocery_list/items_defaults` | List defaults | Add default | Update default | Delete default |
| To-Do | `/todo_list/items` | List items | Add item | Update item | Delete item |
| Recipes | `/recipes` | List recipes | Add recipe | Update recipe | Delete recipe |
| Meal Plans | `/meal-plans` | List plans | Add plan | Update plan | Delete plan |
| Adventures | `/adventures` | List adventures | Add adventure | Update adventure | Delete adventure |
| Birthdays | `/birthdays/items` | List birthdays | Add birthday | Update birthday | Delete birthday |
| Noise | `/noise-tracking` | List items | Add item | — | Delete item |
| Office | `/office-attendance` | List attendance | Add attendance | — | Delete attendance |
| Projects | `/projects` | List projects | Create project | — | Leave project |
| Project Members | `/projects/members` | List members | — | — | Remove `/{userId}` |
| User Prefs | `/user/preferences` | Get prefs | Update prefs | — | — |
| Push Subs | `/push-subscriptions` | — | Save sub | — | Delete sub |
| Upload URLs | `/{resource}/upload-url` | Get signed URL (`?extension=`) | — | — | — |

---

## Implementation Phases

### Phase 0: Project Scaffold
**Goal**: Empty app builds and runs on simulator.

- Create Xcode project at `packages/ios/Kairos/`
- iOS 17 minimum deployment target
- Add `KeychainAccess` via SPM
- Basic `KairosApp.swift` → empty `ContentView`
- Add `.gitignore` for Swift artifacts (`*.xcuserdata`, `.build/`, `DerivedData/`)
- Add `packages/ios/` to root `.prettierignore`
- Verify build + empty test suite passes

### Phase 1: Auth + Networking
**Goal**: User can log in via Google, see empty tab bar, log out.

- **Models**: All `Codable` structs and enums (pure data, no dependencies)
- **Networking**: `APIClient` protocol + URLSession implementation, `Endpoint` enum
- **Auth**: `AuthStore` with `ASWebAuthenticationSession`, `KeychainService`, token refresh
- **Views**: `LoginView`, `ContentView` (auth gate → TabView skeleton)
- **Infra change**: Add `kairos://auth/callback` to Cognito `callback_urls` in `packages/infra/modules/cognito/main.tf:94`
- **Tests**: `APIClientTests`, `EndpointTests`, `AuthStoreTests`

### Phase 2: Projects + Core Wiring
**Goal**: User can see/switch projects and access user menu.

- **Stores**: `ProjectStore` (fetch projects, switch, user preferences), `AppStateStore`
- **DI**: `DependencyContainer` wiring all stores
- **Views**: `ProjectSwitcherView`, `UserMenuView` (basic: project info, switch, logout)
- **Tests**: `ProjectStoreTests`

### Phase 3: Shops + Grocery Lists
**Goal**: Full grocery shopping workflow (highest daily-use feature).

- **Stores**: `ShopStore`, `GroceryStore`
- **Views**: `ShopListView`, `ShopRowView`, `AddShopSheet`, `EditShopSheet`, `GroceryListView` (3 view modes), `GroceryItemRow` (with `.swipeActions`), `AddGroceryItemView`, `EditGroceryItemView`, `GroceryViewModePicker`
- **Shared views**: `SwipeActionRow`, `AsyncS3Image`, `EmptyStateView`, `LoadingView`
- **Utilities**: `CategoryMatcher` (port from web), `HapticFeedback`
- **Tests**: `ShopStoreTests`, `GroceryStoreTests`, `CategoryMatcherTests`

### Phase 4: Planner / To-Do
**Goal**: Full task management with 3 view modes.

- **Store**: `PlannerStore`
- **Views**: `PlannerView` (segmented control), `PlannerCalendarView`, `PlannerWeeklyView`, `PlannerGroupedView`, `TodoItemRow`, `TodoStepRow`, `AddTodoItemView`, `EditTodoItemView`
- **Tests**: `PlannerStoreTests`

### Phase 5: Recipes + Meal Plans
**Goal**: Recipe library and meal planning.

- **Stores**: `RecipeStore`, `MealPlanStore`
- **Views**: `RecipeListView` (search + filter), `RecipeCard`, `RecipeDetailView`, `AddRecipeView`, `EditRecipeView`, `RecipeFilterSheet`, `AddMealPlanSheet`
- **Features**: Image upload via pre-signed S3 URL, ingredient builder
- **Tests**: `RecipeStoreTests`, `MealPlanStoreTests`

### Phase 6: Home Dashboard
**Goal**: Aggregated dashboard with all domain data.

- **Views**: `HomeView`, `HomeGrocerySection`, `HomeTodoSection`, `HomeNoiseSection`, `HomeBirthdaySection`, `HomeAdventureSection`, `HomeMealPlanSection`
- **Logic**: Port `useHomeData` aggregation (pending items, stats, upcoming items)

### Phase 7: Secondary Domains
**Goal**: All 10 domain areas functional.

- **Stores**: `AdventureStore`, `BirthdayStore`, `NoiseTrackingStore`, `OfficeAttendanceStore`
- **Views**: Adventure CRUD, Birthday CRUD, Noise tracking + stats, Office attendance
- **Tests**: One test file per store

### Phase 8: Project Members + Polish
**Goal**: Feature-complete with polished UX.

- **Store**: `ProjectMembersStore`
- **Views**: `MemberListView`, `ProjectSettingsView`, invite code sharing, create/join project flows
- **Polish**: `AlertBanner` (toast notifications), haptic feedback on completions, `.refreshable` on all lists, empty states, loading skeletons, error retry

### Phase 9: Push Notifications
**Goal**: Remote notifications working end-to-end.

- Register for APNs, send device token to backend
- Handle incoming notifications
- Configure notification categories + actions
- Deep-link from notification tap to relevant screen
- **Note**: May need a small backend change to accept APNs tokens alongside VAPID subscriptions

### Phase 10: App Store Prep
**Goal**: App Store submission.

- App icon, launch screen
- App Store screenshots + metadata
- Privacy policy
- Final QA pass
- TestFlight external testing → App Store submission

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

## Critical Files to Reference During Implementation

| Purpose | File Path |
|---|---|
| Shared type definitions | `packages/shared/types/*.ts` |
| Shared enum definitions | `packages/shared/enums/*.ts` |
| Web-only enums (grocery, planner) | `packages/web/src/enums/*.ts` |
| API client factory pattern | `packages/web/src/api/index.ts` |
| API header construction | `packages/web/src/utils/api.ts` |
| OIDC configuration | `packages/web/src/config/oidc.ts` |
| Cognito Terraform (callback URLs) | `packages/infra/modules/cognito/main.tf:94` |
| Provider patterns (reference impl) | `packages/web/src/providers/ShopProvider/index.tsx` |
| Generic CRUD hook | `packages/web/src/hooks/useEntityCrud/index.ts` |
| Category matcher logic | `packages/web/src/utils/categoryMatcher/` |
| Home dashboard aggregation | `packages/web/src/hooks/useHomeData/` |

---

## Verification

After each phase:
1. Run `xcodebuild test` — all tests pass
2. Build and run on simulator — no crashes
3. Manual QA of the phase's features
4. Deploy to TestFlight for device testing
