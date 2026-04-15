import Foundation
import Observation

/// Mirrors `packages/web/src/providers/ProjectProvider/ProjectProvider.tsx`.
///
/// Loads the user's project list + their `UserPreferences` on sign-in, picks the
/// active project (saved → personal → first), and persists the choice back to the
/// `PUT /user/preferences` endpoint when the user switches.
///
/// **Scope:** all endpoints here are user-scoped — `APIClient` is called with
/// `projectScoped: false` so no `X-Project-ID` header is injected. The members
/// endpoint (which _does_ require `X-Project-ID`) lives in `ProjectMembersStore`
/// (Phase 8a).
///
/// **Token for `APIClient`:** `URLSessionAPIClient` reads the current project id
/// through a closure injected by `DependencyContainer`. That closure points at
/// `currentProject?.id`, so every downstream project-scoped store automatically
/// uses whatever project is active here (falls back to `legacy-shared-project`
/// when none is set — handled by `URLSessionAPIClient`).
@MainActor
@Observable
final class ProjectStore {
    /// All projects the signed-in user is a member of.
    private(set) var projects: [Project] = []

    /// Currently active project. Nil until the first fetch completes or when
    /// signed out.
    private(set) var currentProject: Project?

    /// True while the initial fetch (projects + preferences) is in flight.
    var isLoading: Bool = false

    /// True if the last fetch failed. Cleared on the next successful fetch.
    var isError: Bool = false

    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    // MARK: - Project id provider for APIClient

    /// Closure the `APIClient` uses to pick up the current project id for every
    /// project-scoped call. Hops to main and reads `currentProject?.id`.
    nonisolated func currentProjectIdProvider() -> @Sendable () async -> String? {
        let store = self
        return { await store.currentProject?.id }
    }

    // MARK: - Fetch

    /// Load the user's projects + preferences and select the active project.
    ///
    /// Selection rules (mirrors the web app):
    /// 1. `UserPreferences.currentProjectId` if the project is still in the list.
    /// 2. Otherwise the personal project (`isPersonal == true`).
    /// 3. Otherwise the first project in the list.
    ///
    /// When fallback (2) or (3) is used, the choice is persisted back to
    /// `/user/preferences` so the server stays in sync.
    func fetch() async {
        isLoading = true
        defer { isLoading = false }

        do {
            async let projectsTask: [Project] = apiClient.get(endpoint: .projects, projectScoped: false)
            async let preferencesTask: UserPreferences = apiClient.get(endpoint: .userPreferences, projectScoped: false)
            let (fetchedProjects, preferences) = try await (projectsTask, preferencesTask)
            self.projects = fetchedProjects
            self.isError = false
            await selectInitialProject(from: fetchedProjects, preferences: preferences)
        } catch {
            print("ProjectStore.fetch failed: \(error.localizedDescription)")
            self.projects = []
            self.currentProject = nil
            self.isError = true
        }
    }

    // MARK: - Switch

    /// Switch the active project and persist the choice via `PUT /user/preferences`.
    /// Mirrors the web app: the local state flips immediately; a failed persist is
    /// logged but does not roll back — the user still sees the switch.
    func switchProject(to projectId: String) async {
        guard let project = projects.first(where: { $0.id == projectId }) else { return }
        currentProject = project
        do {
            let _: UserPreferences = try await apiClient.put(
                endpoint: .userPreferences,
                body: UpdateUserPreferencesRequest(currentProjectId: projectId),
                projectScoped: false
            )
        } catch {
            print("ProjectStore.switchProject failed to persist preference: \(error.localizedDescription)")
        }
    }

    /// Clear all state. Called when the user signs out so the next session starts fresh.
    func reset() {
        projects = []
        currentProject = nil
        isError = false
        isLoading = false
    }

    // MARK: - Internal

    private func selectInitialProject(from projects: [Project], preferences: UserPreferences) async {
        if let savedId = preferences.currentProjectId,
           let saved = projects.first(where: { $0.id == savedId }) {
            currentProject = saved
            return
        }

        if let personal = projects.first(where: { $0.isPersonal }) {
            currentProject = personal
            await persistPreference(currentProjectId: personal.id)
            return
        }

        if let first = projects.first {
            currentProject = first
            await persistPreference(currentProjectId: first.id)
            return
        }

        currentProject = nil
    }

    private func persistPreference(currentProjectId: String) async {
        do {
            let _: UserPreferences = try await apiClient.put(
                endpoint: .userPreferences,
                body: UpdateUserPreferencesRequest(currentProjectId: currentProjectId),
                projectScoped: false
            )
        } catch {
            print("ProjectStore.persistPreference failed: \(error.localizedDescription)")
        }
    }
}

/// Wire format for `PUT /user/preferences`. Mirrors
/// `packages/shared/types/userPreferences.ts` → `IUpdateUserPreferencesRequest`.
struct UpdateUserPreferencesRequest: Codable, Sendable, Equatable {
    var currentProjectId: String?
    var currentShopId: String?
}
