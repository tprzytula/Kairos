# Phase 9b — Sign in with Apple

**Goal**: User can authenticate via Sign in with Apple end-to-end. The button currently in `LoginView` becomes functional.

**Depends on**: Phase 1 (Cognito hosted UI flow + `AuthStore` + `OIDCClient` already in place).

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md`, current `AuthStore`/`OIDCClient` implementations.

---

## Why this phase exists

App Store Review Guideline 4.8 requires "Sign in with Apple" to be offered alongside any third-party social login (currently we offer Google). Without this, App Store Connect will reject the build at review.

The button is already wired in `LoginView` from Phase 1 — calling it surfaces a "coming soon" alert. This phase makes it actually authenticate.

## Prerequisites (out of scope of this repo)

| Prerequisite | Who does it | Notes |
|---|---|---|
| Paid Apple Developer Program membership | User (manual) | $99/yr — required for the App ID capability and Services ID |
| Sign in with Apple capability on `com.kairos.app` App ID | User (manual) | In Apple Developer Console → Identifiers → App IDs → check "Sign In with Apple" |
| Services ID + Sign in with Apple key | User (manual) | See "Step 1" below |
| 4 GitHub Actions secrets added | User (manual) | See "Step 2" below |

## Architecture choice

Two paths exist; recommend Path 1.

### Path 1 (recommended) — reuse the hosted UI flow with `identity_provider` hint

User taps "Sign in with Apple" → `ASWebAuthenticationSession` opens with `identity_provider=SignInWithApple` query param appended to the Cognito authorize URL → Cognito skips its own IdP picker and redirects directly to Apple → Apple sheet appears → user authenticates → callback to Cognito → callback to `kairos://auth/callback` → `AuthStore` handles tokens like the Google flow.

- **Pros**: ~10 lines of iOS code, no Lambda, no custom auth flow, reuses everything from Phase 1.
- **Cons**: Apple sheet appears inside `ASWebAuthenticationSession` (a Safari-style web view), not the native iOS bottom sheet.

### Path 2 — native `ASAuthorizationController` + custom Cognito auth flow

User taps button → native iOS Apple sheet (no web view, Face ID inline) → app receives Apple identity token → app calls a custom Cognito auth flow Lambda that validates the Apple token, finds/creates the user, and returns Cognito tokens.

- **Pros**: native sheet UX (no Safari-style window).
- **Cons**: ~70 LOC iOS + ~80 LOC Lambda + 3 Cognito custom auth triggers (`DefineAuthChallenge`, `CreateAuthChallenge`, `VerifyAuthChallengeResponse`) + IAM. Significantly more failure surface.

**This document covers Path 1.** If Path 2 is needed later, Phase 9b can be split (9b → hosted, 9c → native) without rework.

---

## Step 1 — Apple Developer Console (manual, ~30 min, one-time)

In `developer.apple.com`:

1. **Confirm `com.kairos.app` App ID has Sign In with Apple capability**
   - Identifiers → App IDs → `com.kairos.app` → Edit → check "Sign In with Apple" → Save.

2. **Create a Services ID**
   - Identifiers → `+` → Services IDs → Continue
   - Description: `Kairos Sign In with Apple`
   - Identifier: `com.kairos.app.signin` (this becomes the `client_id` for Cognito)
   - Continue → Register
   - Edit the new Services ID → check "Sign In with Apple" → Configure:
     - **Primary App ID**: `com.kairos.app`
     - **Domains and Subdomains**: `5rndghxqgv-kairos.auth.eu-west-2.amazoncognito.com`
     - **Return URLs**: `https://5rndghxqgv-kairos.auth.eu-west-2.amazoncognito.com/oauth2/idpresponse`
   - Save → Continue → Save

3. **Create a Sign in with Apple key**
   - Keys → `+`
   - Key Name: `Kairos SIWA Key`
   - Check "Sign In with Apple" → Configure → select `com.kairos.app` as Primary App ID → Save
   - Continue → Register
   - **Download the `.p8` file** (you only get one chance — store it somewhere safe like 1Password)
   - Note the **Key ID** (10-char alphanumeric, shown above the download)

4. **Note your Team ID**
   - Top-right of the Apple Developer Console (10-char alphanumeric)

You should now have these four values:

| Value | Where it's used |
|---|---|
| Services ID (e.g. `com.kairos.app.signin`) | Cognito `provider_details.client_id` |
| Team ID (10 chars) | Cognito `provider_details.team_id` |
| Key ID (10 chars) | Cognito `provider_details.key_id` |
| Private key contents (whole `.p8` file) | Cognito `provider_details.private_key` |

## Step 2 — Add 4 GitHub Actions secrets

In the GitHub repo settings → Secrets and variables → Actions, add:

| Secret name | Value |
|---|---|
| `APPLE_SERVICES_ID` | `com.kairos.app.signin` |
| `APPLE_TEAM_ID` | (your Team ID) |
| `APPLE_KEY_ID` | (your Key ID) |
| `APPLE_PRIVATE_KEY` | The full contents of the `.p8` file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines |

## Step 3 — Cognito Terraform changes

All edits in `packages/infra/modules/cognito/`.

### 3.1 — Add 4 variables (`variables.tf`)

```hcl
variable "apple_services_id" {
  description = "Apple Services ID for Sign in with Apple (e.g. com.kairos.app.signin)"
  type        = string
  default     = ""
}

variable "apple_team_id" {
  description = "Apple Developer Team ID"
  type        = string
  default     = ""
}

variable "apple_key_id" {
  description = "Apple Sign In with Apple Key ID"
  type        = string
  default     = ""
}

variable "apple_private_key" {
  description = "Apple Sign In with Apple private key (.p8 file contents)"
  type        = string
  default     = ""
  sensitive   = true
}
```

### 3.2 — Add the IdP resource (`main.tf`)

Append this resource alongside the existing Google IdP setup:

```hcl
resource "aws_cognito_identity_provider" "apple" {
  count = var.apple_services_id != "" && var.apple_team_id != "" && var.apple_key_id != "" && var.apple_private_key != "" ? 1 : 0

  user_pool_id  = aws_cognito_user_pool.kairos_user_pool.id
  provider_name = "SignInWithApple"
  provider_type = "SignInWithApple"

  provider_details = {
    client_id        = var.apple_services_id
    team_id          = var.apple_team_id
    key_id           = var.apple_key_id
    private_key      = var.apple_private_key
    authorize_scopes = "email name"
  }

  attribute_mapping = {
    email       = "email"
    given_name  = "firstName"
    family_name = "lastName"
    username    = "sub"
  }
}
```

### 3.3 — Update `supported_identity_providers` on the user pool client (`main.tf`)

Replace the current line:

```hcl
supported_identity_providers = var.google_client_id != "" && var.google_client_secret != "" ? ["Google"] : ["COGNITO"]
```

With:

```hcl
supported_identity_providers = compact([
  var.google_client_id != "" && var.google_client_secret != "" ? "Google" : "",
  var.apple_services_id != "" ? "SignInWithApple" : "",
  "COGNITO",
])

depends_on = [
  aws_cognito_identity_provider.google,
  aws_cognito_identity_provider.apple,
]
```

(The `depends_on` is necessary so Terraform creates the IdP before referencing it on the client.)

### 3.4 — Wire the variables in `packages/infra/main.tf`

Add the four `apple_*` variables to the `cognito` module block.

### 3.5 — Pass secrets from CI

In whichever GitHub Actions workflow runs `terraform apply` (typically the deploy workflow), add to `env:`:

```yaml
TF_VAR_apple_services_id: ${{ secrets.APPLE_SERVICES_ID }}
TF_VAR_apple_team_id: ${{ secrets.APPLE_TEAM_ID }}
TF_VAR_apple_key_id: ${{ secrets.APPLE_KEY_ID }}
TF_VAR_apple_private_key: ${{ secrets.APPLE_PRIVATE_KEY }}
```

## Step 4 — iOS code changes

### 4.1 — Generalize `OIDCClient.authorize`

In `packages/ios/Kairos/Kairos/Auth/OIDCClient.swift`:

```swift
protocol OIDCClient: Sendable {
    /// `identityProvider` — Cognito IdP name to skip the hosted-UI picker
    /// (e.g. `"SignInWithApple"`, `"Google"`). Pass `nil` to show the picker.
    func authorize(identityProvider: String?) async throws -> StoredTokens
    func refresh(refreshToken: String) async throws -> StoredTokens
    func logout() async
}

extension OIDCClient {
    func authorize() async throws -> StoredTokens {
        try await authorize(identityProvider: nil)
    }
}
```

In `CognitoOIDCClient.authorize`, thread the parameter through:

```swift
func authorize(identityProvider: String?) async throws -> StoredTokens {
    let pkce = PKCE.generate()
    let state = UUID().uuidString
    let callbackURL = try await launchAuthSession(
        pkce: pkce, state: state, identityProvider: identityProvider
    )
    let code = try extractCode(from: callbackURL, expectedState: state)
    return try await exchangeCode(code, codeVerifier: pkce.verifier)
}
```

In `launchAuthSession`, add the query item if non-nil:

```swift
private func launchAuthSession(pkce: PKCE, state: String, identityProvider: String?) async throws -> URL {
    var components = URLComponents(url: OIDCConfiguration.authorizationEndpoint, resolvingAgainstBaseURL: false)!
    var queryItems: [URLQueryItem] = [
        URLQueryItem(name: "response_type", value: "code"),
        URLQueryItem(name: "client_id", value: OIDCConfiguration.clientID),
        URLQueryItem(name: "redirect_uri", value: OIDCConfiguration.redirectURI),
        URLQueryItem(name: "scope", value: OIDCConfiguration.scopes.joined(separator: " ")),
        URLQueryItem(name: "state", value: state),
        URLQueryItem(name: "code_challenge", value: pkce.challenge),
        URLQueryItem(name: "code_challenge_method", value: "S256"),
    ]
    if let identityProvider {
        queryItems.append(URLQueryItem(name: "identity_provider", value: identityProvider))
    }
    components.queryItems = queryItems
    // ... rest unchanged
}
```

### 4.2 — Replace `AuthStore.signInWithApple` stub

In `packages/ios/Kairos/Kairos/Auth/AuthStore.swift`, replace the existing stub with the real implementation (mirrors `signIn()`):

```swift
func signInWithApple() async {
    isLoading = true
    isError = false
    lastErrorMessage = nil
    defer { isLoading = false }

    do {
        let newTokens = try await oidcClient.authorize(identityProvider: "SignInWithApple")
        try keychainService.saveTokens(newTokens)
        tokens = newTokens
        isAuthenticated = true
    } catch let error as AppError where error == .authCancelled {
        // silent — user cancelled
    } catch {
        isError = true
        lastErrorMessage = error.localizedDescription
        print("AuthStore.signInWithApple failed: \(error.localizedDescription)")
    }
}
```

### 4.3 — Update `MockOIDCClient`

In `packages/ios/Kairos/KairosTests/Mocks/MockOIDCClient.swift`, update the protocol conformance to match the new `authorize(identityProvider:)` signature. Add a `lastIdentityProviderSent` capture so tests can assert which IdP was requested.

### 4.4 — Add tests

In `packages/ios/Kairos/KairosTests/Auth/AuthStoreTests.swift`, add:

- `signInWithApple succeeds → persists tokens, isAuthenticated = true`
- `signInWithApple → calls authorize with identityProvider: "SignInWithApple"`
- `signInWithApple cancellation → silent, no error state`
- `signInWithApple failure → sets isError + lastErrorMessage`

## Step 5 — Verification

1. Apple Developer Console steps complete (user has all 4 secrets).
2. GitHub Actions secrets added.
3. Terraform PR opened, merged. CI applies — confirm in AWS Console that the user-pool client now lists both `Google` and `SignInWithApple` under supported IdPs.
4. iOS code change PR opened, merged.
5. Run app on a real device (Apple sign-in does not work on simulator without iCloud/Face ID).
6. Tap "Sign in with Apple" → Apple auth sheet appears (inside ASWebAuthenticationSession).
7. Authenticate with Face ID / Touch ID / password.
8. Expect to land on the TabView signed in.
9. Kill + relaunch the app — session restores from Keychain, no re-login.
10. Sign out → back to LoginView, tokens cleared.
11. Update `docs/ios-rewrite/PROGRESS.md`:
    - Mark Phase 9b ✅ in the status table
    - Remove the "[2026-04-13, phase 1] Sign in with Apple — backend wiring needed before App Store submission" entry from Open questions
    - Append a Completed phases line

## Acceptance criteria

- Cognito user pool accepts Apple as an IdP (verified via AWS Console).
- iOS app's "Sign in with Apple" button completes the full PKCE flow and lands on the TabView with valid tokens persisted to Keychain.
- App Store Review Guideline 4.8 satisfied — Phase 10 is no longer blocked on this work.
- All `AuthStoreTests` pass, including the new Apple-specific cases.
