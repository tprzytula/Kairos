import Foundation

/// Configuration constants for the Kairos backend.
enum APIConfiguration {
    /// Production API base URL. Mirrors `packages/web/src/api/index.ts`.
    static let baseURL = URL(string: "https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1")!

    /// Fallback project ID used when no project is selected.
    /// Mirrors `LEGACY_PROJECT_ID` in `packages/web/src/utils/api.ts`.
    static let fallbackProjectId = "legacy-shared-project"
}
