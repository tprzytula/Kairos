import Foundation
import Testing
@testable import Kairos

@MainActor
@Suite("Given an AuthStore")
struct AuthStoreTests {

    private func makeStore(
        oidc: MockOIDCClient = MockOIDCClient(),
        keychain: InMemoryKeychainService = InMemoryKeychainService()
    ) -> AuthStore {
        AuthStore(oidcClient: oidc, keychainService: keychain)
    }

    private func sampleTokens(
        idToken: String = "id-token",
        accessToken: String = "access-token",
        refreshToken: String = "refresh-token",
        expiresInSeconds: TimeInterval = 3600
    ) -> StoredTokens {
        StoredTokens(
            idToken: idToken,
            accessToken: accessToken,
            refreshToken: refreshToken,
            accessTokenExpiresAt: Date().timeIntervalSince1970 + expiresInSeconds
        )
    }

    @Test("when signIn succeeds, it should persist tokens and flip isAuthenticated")
    func signInPersistsTokens() async {
        let tokens = sampleTokens()
        let oidc = MockOIDCClient(authorizeResult: .success(tokens))
        let keychain = InMemoryKeychainService()
        let store = makeStore(oidc: oidc, keychain: keychain)

        await store.signIn()

        #expect(store.isAuthenticated)
        #expect(store.tokens == tokens)
        #expect(store.isLoading == false)
        #expect(store.isError == false)
        #expect((try? keychain.loadTokens()) == tokens)
    }

    @Test("when signIn fails, it should set isError and leave the user signed out")
    func signInFailureSetsErrorState() async {
        let oidc = MockOIDCClient(authorizeResult: .failure(AppError.authFailed(reason: "boom")))
        let store = makeStore(oidc: oidc)

        await store.signIn()

        #expect(store.isAuthenticated == false)
        #expect(store.isError)
        #expect(store.lastErrorMessage != nil)
    }

    @Test("when the user cancels signIn, it should not surface an error")
    func signInCancellationIsSilent() async {
        let oidc = MockOIDCClient(authorizeResult: .failure(AppError.authCancelled))
        let store = makeStore(oidc: oidc)

        await store.signIn()

        #expect(store.isError == false)
        #expect(store.lastErrorMessage == nil)
        #expect(store.isAuthenticated == false)
    }

    @Test("when signOut is called, it should clear tokens from Keychain and toggle isAuthenticated")
    func signOutClearsTokens() async {
        let keychain = InMemoryKeychainService(initial: sampleTokens())
        let oidc = MockOIDCClient()
        let store = makeStore(oidc: oidc, keychain: keychain)
        await store.restoreSession()
        #expect(store.isAuthenticated)

        await store.signOut()

        #expect(store.isAuthenticated == false)
        #expect(store.tokens == nil)
        #expect((try? keychain.loadTokens()) == nil)
        #expect(oidc.logoutCallCount == 1)
    }

    @Test("when restoreSession finds tokens, it should mark the user authenticated without calling OIDC")
    func restoreSessionLoadsFromKeychain() async {
        let stored = sampleTokens()
        let keychain = InMemoryKeychainService(initial: stored)
        let oidc = MockOIDCClient()
        let store = makeStore(oidc: oidc, keychain: keychain)

        await store.restoreSession()

        #expect(store.isAuthenticated)
        #expect(store.tokens == stored)
        #expect(oidc.authorizeCallCount == 0)
    }

    @Test("when restoreSession finds no tokens, it should leave isAuthenticated false")
    func restoreSessionWithEmptyKeychain() async {
        let store = makeStore()

        await store.restoreSession()

        #expect(store.isAuthenticated == false)
        #expect(store.tokens == nil)
    }

    @Test("when stored tokens are expired, restoreSession should refresh them")
    func restoreSessionRefreshesExpiredTokens() async {
        let expired = sampleTokens(idToken: "old", expiresInSeconds: -10)
        let refreshed = sampleTokens(idToken: "new", expiresInSeconds: 3600)
        let keychain = InMemoryKeychainService(initial: expired)
        let oidc = MockOIDCClient(refreshResult: .success(refreshed))
        let store = makeStore(oidc: oidc, keychain: keychain)

        await store.restoreSession()

        #expect(oidc.refreshCallCount == 1)
        #expect(oidc.lastRefreshTokenSent == expired.refreshToken)
        #expect(store.tokens?.idToken == "new")
        #expect((try? keychain.loadTokens())?.idToken == "new")
    }

    @Test("when refreshIfNeeded runs while the token is still valid, it should be a no-op")
    func refreshIfNeededIsNoOpWhenTokenFresh() async {
        let fresh = sampleTokens(expiresInSeconds: 3600)
        let oidc = MockOIDCClient()
        let store = makeStore(oidc: oidc, keychain: InMemoryKeychainService(initial: fresh))
        await store.restoreSession()

        await store.refreshIfNeeded()

        // restoreSession only refreshes for expired tokens, so the call count
        // should still be 0 here.
        #expect(oidc.refreshCallCount == 0)
    }

    @Test("when refresh fails, it should clear the session so the user returns to LoginView")
    func failedRefreshClearsSession() async {
        let expired = sampleTokens(expiresInSeconds: -10)
        let keychain = InMemoryKeychainService(initial: expired)
        let oidc = MockOIDCClient(refreshResult: .failure(AppError.authFailed(reason: "expired")))
        let store = makeStore(oidc: oidc, keychain: keychain)

        await store.restoreSession()

        #expect(store.isAuthenticated == false)
        #expect(store.tokens == nil)
        #expect((try? keychain.loadTokens()) == nil)
    }

    @Test("the idToken provider should expose the current id token")
    func idTokenProviderReadsCurrentToken() async {
        let store = makeStore()
        let provider = store.idTokenProvider()
        #expect(await provider() == nil)

        let tokens = sampleTokens(idToken: "fresh-id")
        let oidc = MockOIDCClient(authorizeResult: .success(tokens))
        let store2 = AuthStore(oidcClient: oidc, keychainService: InMemoryKeychainService())
        let provider2 = store2.idTokenProvider()
        await store2.signIn()
        #expect(await provider2() == "fresh-id")
    }
}
