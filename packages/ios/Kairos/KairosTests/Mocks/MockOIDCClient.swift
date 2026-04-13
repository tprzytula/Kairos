import Foundation
@testable import Kairos

/// In-memory `OIDCClient` for `AuthStore` tests.
final class MockOIDCClient: OIDCClient, @unchecked Sendable {
    private let lock = NSLock()
    private var _authorizeResult: Result<StoredTokens, Error>
    private var _refreshResult: Result<StoredTokens, Error>
    private var _authorizeCallCount = 0
    private var _refreshCallCount = 0
    private var _logoutCallCount = 0
    private var _lastRefreshTokenSent: String?

    init(
        authorizeResult: Result<StoredTokens, Error> = .failure(AppError.authFailed(reason: "not stubbed")),
        refreshResult: Result<StoredTokens, Error> = .failure(AppError.authFailed(reason: "not stubbed"))
    ) {
        self._authorizeResult = authorizeResult
        self._refreshResult = refreshResult
    }

    var authorizeCallCount: Int { withLock { _authorizeCallCount } }
    var refreshCallCount: Int { withLock { _refreshCallCount } }
    var logoutCallCount: Int { withLock { _logoutCallCount } }
    var lastRefreshTokenSent: String? { withLock { _lastRefreshTokenSent } }

    func setAuthorizeResult(_ result: Result<StoredTokens, Error>) {
        withLock { _authorizeResult = result }
    }

    func setRefreshResult(_ result: Result<StoredTokens, Error>) {
        withLock { _refreshResult = result }
    }

    func authorize() async throws -> StoredTokens {
        let result = withLock { () -> Result<StoredTokens, Error> in
            _authorizeCallCount += 1
            return _authorizeResult
        }
        return try result.get()
    }

    func refresh(refreshToken: String) async throws -> StoredTokens {
        let result = withLock { () -> Result<StoredTokens, Error> in
            _refreshCallCount += 1
            _lastRefreshTokenSent = refreshToken
            return _refreshResult
        }
        return try result.get()
    }

    func logout() async {
        withLock { _logoutCallCount += 1 }
    }

    private func withLock<R>(_ block: () -> R) -> R {
        lock.lock(); defer { lock.unlock() }
        return block()
    }
}
