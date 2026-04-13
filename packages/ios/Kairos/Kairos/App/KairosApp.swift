import SwiftUI

@main
struct KairosApp: App {
    @State private var container = DependencyContainer()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(container.authStore)
                .task {
                    await container.authStore.restoreSession()
                }
                .onChange(of: scenePhase) { _, phase in
                    if phase == .active {
                        Task { await container.authStore.refreshIfNeeded() }
                    }
                }
        }
    }
}
