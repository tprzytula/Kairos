import Foundation

/// Mirrors `packages/web/src/enums/plannerViewMode.ts` (web-only).
enum PlannerViewMode: String, Codable, Sendable {
    case calendar
    case weekly
    case grouped
}
