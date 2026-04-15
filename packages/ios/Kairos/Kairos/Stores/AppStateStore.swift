import Foundation
import Observation

/// Session-local UI state that is NOT persisted to the backend. Mirrors the web
/// `AppStateProvider` reducer — see
/// `docs/ios-rewrite/01-cross-cutting.md` → AppState Ephemeral UI State.
///
/// Phase 2 introduces only the fields; the views that drive them are added in
/// their respective domain phases (alerts → 8b, purchasedItems → 3c,
/// selectedTodoItems → 4, selectedCalendarDate → 4).
@MainActor
@Observable
final class AppStateStore {
    /// Transient toast notifications keyed by a caller-supplied id.
    private(set) var alerts: [String: AppAlert] = [:]

    /// Grocery item IDs the user has "checked off" during shopping. Items remain
    /// in the backend until explicitly cleared — this set drives the struck-through
    /// UI state only. See Phase 3c.
    private(set) var purchasedItems: Set<String> = []

    /// Todo item IDs that are currently multi-selected (for batch isDone toggle).
    /// See Phase 4.
    private(set) var selectedTodoItems: Set<String> = []

    /// Currently highlighted date in the planner calendar view (ISO `yyyy-MM-dd`).
    /// See Phase 4.
    var selectedCalendarDate: String?

    init() {}

    // MARK: - Alerts

    func showAlert(id: String, description: String, severity: AlertSeverity) {
        alerts[id] = AppAlert(id: id, description: description, severity: severity)
    }

    func hideAlert(id: String) {
        alerts.removeValue(forKey: id)
    }

    // MARK: - Purchased items

    func purchaseGroceryItem(id: String) {
        purchasedItems.insert(id)
    }

    func clearPurchasedItem(id: String) {
        purchasedItems.remove(id)
    }

    func clearPurchasedItems(ids: [String]) {
        for id in ids { purchasedItems.remove(id) }
    }

    // MARK: - Selected todo items

    func selectTodoItem(id: String) {
        selectedTodoItems.insert(id)
    }

    func unselectTodoItem(id: String) {
        selectedTodoItems.remove(id)
    }

    func clearSelectedTodoItems(ids: [String]) {
        for id in ids { selectedTodoItems.remove(id) }
    }

    // MARK: - Reset

    /// Clear all ephemeral state. Called on sign-out so the next session starts fresh.
    func reset() {
        alerts = [:]
        purchasedItems = []
        selectedTodoItems = []
        selectedCalendarDate = nil
    }
}

/// Severity level for a transient `AppAlert`. Mirrors MUI's `AlertColor` values
/// used by `packages/web/src/components/Alert`.
enum AlertSeverity: String, Sendable, Equatable {
    case info
    case success
    case warning
    case error
}

/// Transient toast message surfaced through `AppStateStore.alerts`.
struct AppAlert: Sendable, Equatable, Identifiable {
    let id: String
    let description: String
    let severity: AlertSeverity
}
