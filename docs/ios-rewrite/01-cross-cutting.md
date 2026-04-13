# Cross-Cutting Concerns

These rules apply across ALL phases. Every agent must follow them for consistency. **This file is the single source of truth** — phase files reference these rules, they don't duplicate them.

## Auth Token Injection

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

## Token Refresh Flow

The web app uses OIDC automatic silent renewal:
- `automaticSilentRenew: true`
- `accessTokenExpiringNotificationTimeInSeconds: 300` (5-min warning)
- Token refresh triggered on: app startup (if session exists), visibility change (app foregrounded)

**iOS equivalent**: On `AuthStore`:
- Attempt `signinSilent()` equivalent on app launch if Keychain has tokens
- Refresh tokens on `scenePhase` change to `.active` (replaces `visibilitychange`)
- No explicit 401 retry logic — the web app doesn't have one either. If a token expires mid-session, the next foreground event refreshes it.

## Error Handling Pattern

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

## Loading State Convention

Every store that fetches data must expose `isLoading: Bool`. Views should:
- Show `LoadingView()` when `store.isLoading && store.items.isEmpty` (first load only)
- Show inline `.refreshable {}` spinner on subsequent refreshes
- Never show a full-screen loader when data is already cached

## Update-After-Success Pattern

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

## `isPrivate` ↔ `visibility` Mapping

- **Create/update requests**: send `isPrivate: true` in the request body to mark as private
- **Read responses**: items have `visibility: "private"` (or nil/absent for shared)
- **Display logic**: check `item.visibility == "private"` to determine if item is private
- **UI**: private items should show a lock icon or similar indicator

## Date Format Conventions

| Field | Format | Example |
|-------|--------|---------|
| `createdAt`, `updatedAt` | ISO 8601 string | `"2026-03-15T10:30:00.000Z"` |
| `dueDate` (TodoItem) | Unix timestamp in **milliseconds** (Int) | `1710500000000` |
| `timestamp` (NoiseTracking) | Unix timestamp in **milliseconds** (Int) | `1710500000000` |
| `date` (Adventure, MealPlan, OfficeAttendance) | ISO date string | `"2026-03-15"` |
| `time`, `endTime` (Adventure) | Time string | `"14:30"` |
| `month`, `day` (Birthday) | Int | `3`, `15` |

Use `ISO8601DateFormatter` for ISO strings. Use `Date(timeIntervalSince1970: timestamp / 1000)` for Unix ms timestamps.

## AppState Ephemeral UI State

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

## Verification

After each phase:
1. Run `xcodebuild test` — all tests pass
2. Build and run on simulator — no crashes
3. Manual QA of the phase's features against its acceptance criteria
