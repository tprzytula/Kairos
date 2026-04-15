import SwiftUI

@main
struct KairosApp: App {
    @State private var container = DependencyContainer()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(container.authStore)
                // Phase 2 adds:
                .environment(container.projectStore)
                .environment(container.appStateStore)
                .task {
                    await container.authStore.restoreSession()
                }
                .onChange(of: scenePhase) { _, phase in
                    if phase == .active {
                        Task { await container.authStore.refreshIfNeeded() }
                    }
                }
                .onChange(of: container.authStore.isAuthenticated) { _, isAuthed in
                    Task {
                        if isAuthed {
                            await container.projectStore.fetch()
                        } else {
                            container.projectStore.reset()
                            container.appStateStore.reset()
                        }
                    }
                }
        }
    }
}
