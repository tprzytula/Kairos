import Foundation
@preconcurrency import KeychainAccess

/// Persists the OIDC token bundle to the iOS Keychain.
///
/// We expose a protocol so `AuthStore` is testable with an in-memory mock.
protocol KeychainService: Sendable {
    func loadTokens() throws -> StoredTokens?
    func saveTokens(_ tokens: StoredTokens) throws
    func clear() throws
}

/// Snapshot of the tokens we persist between launches.
struct StoredTokens: Codable, Equatable, Sendable {
    var idToken: String
    var accessToken: String
    var refreshToken: String
    /// Absolute expiry of the access token (seconds since 1970).
    var accessTokenExpiresAt: TimeInterval

    /// True if the access token has already expired (or will within the leeway).
    func isExpired(now: Date = .now, leeway: TimeInterval = 0) -> Bool {
        accessTokenExpiresAt - leeway <= now.timeIntervalSince1970
    }
}

/// Keychain-backed implementation. Stores a single JSON blob under one key so
/// tokens stay consistent (write all, read all).
final class KeychainTokenService: KeychainService, @unchecked Sendable {
    private let keychain: Keychain
    private let storageKey: String

    init(service: String = "com.kairos.app.tokens", storageKey: String = "oidc-tokens") {
        self.keychain = Keychain(service: service)
            .accessibility(.afterFirstUnlockThisDeviceOnly)
        self.storageKey = storageKey
    }

    func loadTokens() throws -> StoredTokens? {
        guard let data = try keychain.getData(storageKey) else { return nil }
        return try JSONDecoder().decode(StoredTokens.self, from: data)
    }

    func saveTokens(_ tokens: StoredTokens) throws {
        let data = try JSONEncoder().encode(tokens)
        try keychain.set(data, key: storageKey)
    }

    func clear() throws {
        try keychain.remove(storageKey)
    }
}

/// In-memory implementation suitable for tests.
final class InMemoryKeychainService: KeychainService, @unchecked Sendable {
    private let lock = NSLock()
    private var tokens: StoredTokens?

    init(initial: StoredTokens? = nil) {
        self.tokens = initial
    }

    func loadTokens() throws -> StoredTokens? {
        lock.lock(); defer { lock.unlock() }
        return tokens
    }

    func saveTokens(_ tokens: StoredTokens) throws {
        lock.lock(); defer { lock.unlock() }
        self.tokens = tokens
    }

    func clear() throws {
        lock.lock(); defer { lock.unlock() }
        tokens = nil
    }
}
