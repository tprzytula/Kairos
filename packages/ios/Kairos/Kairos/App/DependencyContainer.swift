import Foundation

/// Owns the app's long-lived services. Each phase appends one property + one
/// init line. **Never reorder existing entries** — see
/// `docs/ios-rewrite/01-cross-cutting.md` → Shared File Coordination.
@MainActor
final class DependencyContainer {
    // MARK: - Services
    let apiClient: APIClient
    let authStore: AuthStore

    init() {
        let keychainService = KeychainTokenService()
        let oidcClient = CognitoOIDCClient()
        let authStore = AuthStore(oidcClient: oidcClient, keychainService: keychainService)

        self.apiClient = URLSessionAPIClient(
            idTokenProvider: authStore.idTokenProvider(),
            accessTokenProvider: authStore.accessTokenProvider(),
            // Phase 2 will replace this with `ProjectStore.currentProjectId`.
            projectIdProvider: { nil }
        )
        self.authStore = authStore
    }
}
