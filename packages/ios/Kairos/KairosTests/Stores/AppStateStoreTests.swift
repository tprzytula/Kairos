import Foundation
import Testing
@testable import Kairos

@MainActor
@Suite("Given an AppStateStore")
struct AppStateStoreTests {

    @Test("when showAlert is called, it should record the alert keyed by id")
    func showAlertAdds() {
        let store = AppStateStore()

        store.showAlert(id: "a1", description: "Saved", severity: .success)

        #expect(store.alerts["a1"]?.description == "Saved")
        #expect(store.alerts["a1"]?.severity == .success)
    }

    @Test("when hideAlert is called, it should remove the alert")
    func hideAlertRemoves() {
        let store = AppStateStore()
        store.showAlert(id: "a1", description: "Saved", severity: .success)

        store.hideAlert(id: "a1")

        #expect(store.alerts["a1"] == nil)
    }

    @Test("when purchaseGroceryItem is called, it should add to purchasedItems")
    func purchaseAdds() {
        let store = AppStateStore()

        store.purchaseGroceryItem(id: "g1")
        store.purchaseGroceryItem(id: "g2")

        #expect(store.purchasedItems == ["g1", "g2"])
    }

    @Test("when clearPurchasedItem is called, it should remove the id")
    func clearPurchasedRemoves() {
        let store = AppStateStore()
        store.purchaseGroceryItem(id: "g1")

        store.clearPurchasedItem(id: "g1")

        #expect(store.purchasedItems.isEmpty)
    }

    @Test("when clearPurchasedItems is called with multiple ids, it should remove them all")
    func clearPurchasedBulk() {
        let store = AppStateStore()
        store.purchaseGroceryItem(id: "g1")
        store.purchaseGroceryItem(id: "g2")
        store.purchaseGroceryItem(id: "g3")

        store.clearPurchasedItems(ids: ["g1", "g3"])

        #expect(store.purchasedItems == ["g2"])
    }

    @Test("when selectTodoItem and unselectTodoItem are called, it should toggle selection")
    func todoSelectionToggles() {
        let store = AppStateStore()

        store.selectTodoItem(id: "t1")
        store.selectTodoItem(id: "t2")
        store.unselectTodoItem(id: "t1")

        #expect(store.selectedTodoItems == ["t2"])
    }

    @Test("when clearSelectedTodoItems is called, it should remove all listed ids")
    func clearTodoSelection() {
        let store = AppStateStore()
        store.selectTodoItem(id: "t1")
        store.selectTodoItem(id: "t2")

        store.clearSelectedTodoItems(ids: ["t1", "t2"])

        #expect(store.selectedTodoItems.isEmpty)
    }

    @Test("selectedCalendarDate should be mutable directly")
    func calendarDateMutable() {
        let store = AppStateStore()

        store.selectedCalendarDate = "2026-04-15"

        #expect(store.selectedCalendarDate == "2026-04-15")
    }

    @Test("when reset is called, it should clear every field")
    func resetClearsEverything() {
        let store = AppStateStore()
        store.showAlert(id: "a1", description: "x", severity: .info)
        store.purchaseGroceryItem(id: "g1")
        store.selectTodoItem(id: "t1")
        store.selectedCalendarDate = "2026-04-15"

        store.reset()

        #expect(store.alerts.isEmpty)
        #expect(store.purchasedItems.isEmpty)
        #expect(store.selectedTodoItems.isEmpty)
        #expect(store.selectedCalendarDate == nil)
    }
}
