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

/// Phase-1 placeholder. Each tab gets its real content in later phases.
private struct RootTabView: View {
    @Environment(AuthStore.self) private var authStore

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
        NavigationStack {
            VStack(spacing: 16) {
                Image(systemName: systemImage)
                    .font(.system(size: 56))
                    .foregroundStyle(.tint)
                Text(title)
                    .font(.title2)
                Text("Coming in a later phase.")
                    .foregroundStyle(.secondary)
                Button("Sign out") {
                    Task { await authStore.signOut() }
                }
                .buttonStyle(.bordered)
                .padding(.top, 8)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .navigationTitle(title)
        }
    }
}
