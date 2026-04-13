# iOS Rewrite — Overview

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

### SwiftUI Patterns for Key Web Components

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

### Networking

`URLSession` with `async/await`. No third-party networking library.

API contract (verified from `packages/web/src/api/index.ts` and `packages/web/src/utils/api.ts`):
- Base URL: `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1`
- Headers: `Authorization: Bearer <token>`, `X-Project-ID: <id>`, `Content-Type: application/json`
- Fallback project ID: `legacy-shared-project`
- Methods: GET (list), PUT (create), POST `/{id}` (update), DELETE `/{id}` (delete)

See `api-reference.md` for the full endpoint table.

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

See `01-cross-cutting.md` → Shared File Coordination for the append-only pattern phases must use when modifying `DependencyContainer` / `KairosApp`.

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
│   │   │   ├── Shops/
│   │   │   ├── Grocery/
│   │   │   ├── Planner/
│   │   │   ├── Recipes/
│   │   │   ├── MealPlans/
│   │   │   ├── Adventures/
│   │   │   ├── Birthdays/
│   │   │   ├── NoiseTracking/
│   │   │   ├── OfficeAttendance/
│   │   │   ├── Settings/
│   │   │   ├── Auth/
│   │   │   └── Shared/
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
│       ├── Stores/                             # One test file per store
│       ├── Networking/
│       ├── Auth/
│       ├── Utilities/
│       └── Mocks/
```

Each phase file lists the exact views and tests it introduces within this structure.
