import Foundation
import Testing
@testable import Kairos

@MainActor
@Suite("Given a ProjectStore")
struct ProjectStoreTests {

    // MARK: - Fixtures

    private func sampleProject(
        id: String,
        name: String,
        isPersonal: Bool = false
    ) -> Project {
        Project(
            id: id,
            ownerId: "owner-\(id)",
            name: name,
            isPersonal: isPersonal,
            maxMembers: 8,
            inviteCode: "CODE\(id.uppercased())",
            createdAt: "2026-01-01T00:00:00.000Z"
        )
    }

    private func samplePreferences(currentProjectId: String? = nil) -> UserPreferences {
        UserPreferences(
            userId: "user-1",
            currentProjectId: currentProjectId,
            currentShopId: nil,
            lastUpdated: 0
        )
    }

    // MARK: - fetch

    @Test("when fetch succeeds and preferences point at an existing project, it should select that project")
    func fetchSelectsSavedProject() async {
        let personal = sampleProject(id: "personal-1", name: "Personal", isPersonal: true)
        let shared = sampleProject(id: "shared-1", name: "Household")
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [personal, shared])
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "shared-1"))

        let store = ProjectStore(apiClient: mock)
        await store.fetch()

        #expect(store.projects.count == 2)
        #expect(store.currentProject?.id == "shared-1")
        #expect(store.isError == false)
        #expect(store.isLoading == false)
    }

    @Test("when preferences do not point at a known project, it should fall back to the personal project and persist the choice")
    func fetchFallsBackToPersonal() async {
        let personal = sampleProject(id: "personal-1", name: "Personal", isPersonal: true)
        let shared = sampleProject(id: "shared-1", name: "Household")
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [shared, personal])
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "gone-1"))
        mock.stub(method: "PUT", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "personal-1"))

        let store = ProjectStore(apiClient: mock)
        await store.fetch()

        #expect(store.currentProject?.id == "personal-1")
        let putCalls = mock.calls.filter { $0.method == "PUT" && $0.endpoint == .userPreferences }
        #expect(putCalls.count == 1)
        #expect(putCalls.first?.projectScoped == false)
        #expect(putCalls.first?.bodyJSON?.contains("\"currentProjectId\":\"personal-1\"") == true)
    }

    @Test("when there is no personal project, it should fall back to the first project")
    func fetchFallsBackToFirstProject() async {
        let first = sampleProject(id: "first-1", name: "First")
        let second = sampleProject(id: "second-1", name: "Second")
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [first, second])
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences())
        mock.stub(method: "PUT", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "first-1"))

        let store = ProjectStore(apiClient: mock)
        await store.fetch()

        #expect(store.currentProject?.id == "first-1")
    }

    @Test("when the user has no projects, it should leave currentProject nil")
    func fetchWithNoProjects() async {
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [Project]())
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences())

        let store = ProjectStore(apiClient: mock)
        await store.fetch()

        #expect(store.projects.isEmpty)
        #expect(store.currentProject == nil)
        #expect(store.isError == false)
    }

    @Test("when the fetch fails, it should set isError and clear state")
    func fetchFailureSetsIsError() async {
        let mock = MockAPIClient()
        mock.stubError(method: "GET", endpoint: .projects, error: APIError.transport(reason: "offline"))

        let store = ProjectStore(apiClient: mock)
        await store.fetch()

        #expect(store.isError)
        #expect(store.projects.isEmpty)
        #expect(store.currentProject == nil)
        #expect(store.isLoading == false)
    }

    @Test("every fetch call should be user-scoped (no X-Project-ID header implied)")
    func fetchUsesUserScopedCalls() async {
        let personal = sampleProject(id: "personal-1", name: "Personal", isPersonal: true)
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [personal])
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "personal-1"))

        let store = ProjectStore(apiClient: mock)
        await store.fetch()

        let scopes = mock.calls.map(\.projectScoped)
        #expect(scopes.allSatisfy { $0 == false })
    }

    // MARK: - switchProject

    @Test("when switchProject targets a known project, it should update currentProject and persist via PUT /user/preferences")
    func switchProjectPersistsChoice() async {
        let personal = sampleProject(id: "personal-1", name: "Personal", isPersonal: true)
        let shared = sampleProject(id: "shared-1", name: "Household")
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [personal, shared])
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "personal-1"))
        mock.stub(method: "PUT", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "shared-1"))

        let store = ProjectStore(apiClient: mock)
        await store.fetch()
        await store.switchProject(to: "shared-1")

        #expect(store.currentProject?.id == "shared-1")
        let putCalls = mock.calls.filter { $0.method == "PUT" && $0.endpoint == .userPreferences }
        #expect(putCalls.last?.bodyJSON?.contains("\"currentProjectId\":\"shared-1\"") == true)
        #expect(putCalls.last?.projectScoped == false)
    }

    @Test("when switchProject targets an unknown project, it should be a no-op")
    func switchProjectIgnoresUnknown() async {
        let personal = sampleProject(id: "personal-1", name: "Personal", isPersonal: true)
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [personal])
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "personal-1"))

        let store = ProjectStore(apiClient: mock)
        await store.fetch()
        await store.switchProject(to: "does-not-exist")

        #expect(store.currentProject?.id == "personal-1")
    }

    @Test("when the preferences PUT fails during switch, the local current project should still reflect the user's choice")
    func switchProjectPersistFailureIsNonFatal() async {
        let personal = sampleProject(id: "personal-1", name: "Personal", isPersonal: true)
        let shared = sampleProject(id: "shared-1", name: "Household")
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [personal, shared])
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "personal-1"))
        mock.stubError(method: "PUT", endpoint: .userPreferences, error: APIError.transport(reason: "offline"))

        let store = ProjectStore(apiClient: mock)
        await store.fetch()
        await store.switchProject(to: "shared-1")

        #expect(store.currentProject?.id == "shared-1")
    }

    // MARK: - currentProjectIdProvider

    @Test("the project-id provider should read the current project id, defaulting to nil")
    func projectIdProviderReadsCurrentId() async {
        let personal = sampleProject(id: "personal-1", name: "Personal", isPersonal: true)
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [personal])
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "personal-1"))

        let store = ProjectStore(apiClient: mock)
        let provider = store.currentProjectIdProvider()

        #expect(await provider() == nil)
        await store.fetch()
        #expect(await provider() == "personal-1")
    }

    // MARK: - reset

    @Test("reset should clear state so the next session starts fresh")
    func resetClearsState() async {
        let personal = sampleProject(id: "personal-1", name: "Personal", isPersonal: true)
        let mock = MockAPIClient()
        mock.stub(method: "GET", endpoint: .projects, response: [personal])
        mock.stub(method: "GET", endpoint: .userPreferences, response: samplePreferences(currentProjectId: "personal-1"))

        let store = ProjectStore(apiClient: mock)
        await store.fetch()
        #expect(store.currentProject != nil)

        store.reset()

        #expect(store.projects.isEmpty)
        #expect(store.currentProject == nil)
        #expect(store.isError == false)
    }
}
