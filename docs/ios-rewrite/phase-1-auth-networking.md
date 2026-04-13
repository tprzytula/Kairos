# Phase 1 — Auth + Networking

**Goal**: User can log in via Google, see empty tab bar, log out.

**Depends on**: Phase 0.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md`, `models.md`.

## Deliverables

- **Models**: All `Codable` structs and enums from `models.md` (pure data, no dependencies)
- **Networking**: `APIClient` protocol + URLSession implementation with both project-scoped and user-scoped modes (see `01-cross-cutting.md` → Auth Token Injection), `Endpoint` enum covering all paths from `api-reference.md`
- **Auth**: `AuthStore` with `ASWebAuthenticationSession`, `KeychainService`, token refresh on foreground (see `01-cross-cutting.md` → Token Refresh Flow)
- **Views**: `LoginView`, `ContentView` (auth gate → TabView skeleton with 5 empty tabs)
- **Infra change**: Add `kairos://auth/callback` to `callback_urls` AND `kairos://` to `logout_urls` in `packages/infra/modules/cognito/main.tf`
- **Tests**:
  - `APIClientTests`: URL construction, header injection for both scoped modes, error handling
  - `EndpointTests`: all path strings match `api-reference.md` tables
  - `AuthStoreTests`: login flow, token persistence, refresh

## Acceptance criteria

User taps Login → Google sign-in sheet appears → completes OIDC flow → lands on TabView with 5 tabs. Kill and relaunch app → session restored from Keychain (no re-login). Tap Logout → returns to LoginView, tokens cleared from Keychain. All tests pass.
