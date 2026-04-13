import Foundation

/// Cognito OIDC configuration. Mirrors `packages/web/src/config/oidc.ts`.
enum OIDCConfiguration {
    static let authority = URL(string: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_G0ND9mzC2")!

    /// Cognito-hosted UI domain (sibling of `authority` — the `/oauth2/*` endpoints
    /// live here, not on the cognito-idp domain).
    /// Cognito hosted UI domain — sourced from the deployed user-pool domain.
    /// The web app references the same host in `packages/web/src/components/UserMenu/index.tsx`.
    static let hostedUIDomain = URL(string: "https://5rndghxqgv-kairos.auth.eu-west-2.amazoncognito.com")!

    static let clientID = "tr2fu38tohgm19h4lr6dqomc3"
    static let scopes = ["email", "openid", "profile"]

    /// Custom URL scheme registered in `Info.plist` under `CFBundleURLTypes`.
    /// Must also be added to the Cognito user-pool client's allowed callback URLs.
    static let redirectURI = "kairos://auth/callback"
    static let logoutRedirectURI = "kairos://"

    /// `ASWebAuthenticationSession` matches the callback by scheme only.
    static let callbackScheme = "kairos"

    /// Refresh tokens this many seconds before the access token expires.
    /// Mirrors `accessTokenExpiringNotificationTimeInSeconds` in the web config.
    static let refreshLeewaySeconds: TimeInterval = 300

    // MARK: Endpoints (RFC 8414 / Cognito)
    static var authorizationEndpoint: URL {
        hostedUIDomain.appendingPathComponent("oauth2/authorize")
    }

    static var tokenEndpoint: URL {
        hostedUIDomain.appendingPathComponent("oauth2/token")
    }

    static var logoutEndpoint: URL {
        hostedUIDomain.appendingPathComponent("logout")
    }
}
