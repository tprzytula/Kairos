import Foundation

/// Owns the app's long-lived services. Each phase appends one property + one
/// init line. **Never reorder existing entries** — see
/// `docs/ios-rewrite/01-cross-cutting.md` → Shared File Coordination.
@MainActor
final class DependencyContainer {
    // MARK: - Services
    let apiClient: APIClient
    let authStore: AuthStore
    // Phase 2 adds:
    let projectStore: ProjectStore
    let appStateStore: AppStateStore

    init() {
        let keychainService = KeychainTokenService()
        let oidcClient = CognitoOIDCClient()
        let authStore = AuthStore(oidcClient: oidcClient, keychainService: keychainService)

        // `APIClient` needs a current-project-id provider, but the
        // `ProjectStore` that owns that id can't be built until `APIClient`
        // exists. Break the cycle with a late-bound box: the client reads from
        // the box on every request, and we point the box at `ProjectStore`
        // once the store is constructed.
        let projectIdBox = ProjectIdProviderBox()
        let apiClient = URLSessionAPIClient(
            idTokenProvider: authStore.idTokenProvider(),
            accessTokenProvider: authStore.accessTokenProvider(),
            projectIdProvider: { await projectIdBox.get() }
        )
        self.apiClient = apiClient
        self.authStore = authStore

        // Phase 2 adds:
        let projectStore = ProjectStore(apiClient: apiClient)
        projectIdBox.set(projectStore.currentProjectIdProvider())
        self.projectStore = projectStore
        self.appStateStore = AppStateStore()
    }
}

/// Holds a late-initialized project-id provider so `URLSessionAPIClient` can
/// read the current project without owning a reference to `ProjectStore`.
/// Thread-safe because the client calls `get()` from arbitrary tasks while the
/// container sets it once on main during init.
private final class ProjectIdProviderBox: @unchecked Sendable {
    private let lock = NSLock()
    private var provider: @Sendable () async -> String? = { nil }

    func set(_ provider: @escaping @Sendable () async -> String?) {
        withLock { self.provider = provider }
    }

    func get() async -> String? {
        await currentProvider()()
    }

    /// Grabs a snapshot of the current closure under the lock. Synchronous so
    /// the `NSLock` calls stay outside any async context.
    private func currentProvider() -> @Sendable () async -> String? {
        withLock { provider }
    }

    private func withLock<R>(_ body: () -> R) -> R {
        lock.lock(); defer { lock.unlock() }
        return body()
    }
}
