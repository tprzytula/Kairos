import SwiftUI

/// Auth gate. Routes to `LoginView` or the empty 5-tab skeleton based on the
/// `AuthStore` state. Domain tabs are filled in by Phase 3+.
struct ContentView: View {
    @Environment(AuthStore.self) private var authStore

    var body: some View {
        if authStore.isAuthenticated {
            RootTabView()
        } else {
            LoginView()
        }
    }
}

/// Phase-2 placeholder. Each tab gets its real content in later phases.
/// Every tab surfaces a trailing toolbar button that opens the user menu
/// (project switch + sign out) so the project-switching flow is reachable
/// before the domain tabs exist.
private struct RootTabView: View {
    var body: some View {
        TabView {
            placeholder(title: "Home", systemImage: "house.fill")
                .tabItem { Label("Home", systemImage: "house.fill") }

            placeholder(title: "Shops", systemImage: "cart.fill")
                .tabItem { Label("Shops", systemImage: "cart.fill") }

            placeholder(title: "Add", systemImage: "plus.circle.fill")
                .tabItem { Label("Add", systemImage: "plus.circle.fill") }

            placeholder(title: "Recipes", systemImage: "fork.knife")
                .tabItem { Label("Recipes", systemImage: "fork.knife") }

            placeholder(title: "Planner", systemImage: "calendar")
                .tabItem { Label("Planner", systemImage: "calendar") }
        }
    }

    @ViewBuilder
    private func placeholder(title: String, systemImage: String) -> some View {
        PlaceholderTab(title: title, systemImage: systemImage)
    }
}

private struct PlaceholderTab: View {
    @Environment(ProjectStore.self) private var projectStore
    let title: String
    let systemImage: String
    @State private var isShowingUserMenu = false

    var body: some View {
        NavigationStack {
            centerContent
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(.systemBackground))
                .navigationTitle(title)
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            HapticFeedback.impact(.light)
                            isShowingUserMenu = true
                        } label: {
                            Image(systemName: "person.crop.circle")
                                .accessibilityLabel("Account menu")
                        }
                    }
                }
                .sheet(isPresented: $isShowingUserMenu) {
                    UserMenuView()
                }
        }
    }

    @ViewBuilder
    private var centerContent: some View {
        if projectStore.isError {
            ContentUnavailableView {
                Label("Couldn't load your projects", systemImage: "exclamationmark.triangle")
            } description: {
                Text("Check your connection and try again.")
            } actions: {
                Button("Retry") {
                    Task { await projectStore.fetch() }
                }
                .buttonStyle(.borderedProminent)
            }
        } else if projectStore.isLoading && projectStore.projects.isEmpty {
            ProgressView()
                .controlSize(.large)
        } else {
            ContentUnavailableView {
                Label(title, systemImage: systemImage)
            } description: {
                Text("Coming in a later phase.")
            }
        }
    }
}
