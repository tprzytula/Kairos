import Foundation

/// Intercepts `URLSession` requests so tests can verify URL/header construction
/// and stub responses without hitting the network.
final class MockURLProtocol: URLProtocol, @unchecked Sendable {
    /// Closure invoked for every request. Return either response data + status
    /// or throw to simulate a transport error.
    nonisolated(unsafe) static var requestHandler: (@Sendable (URLRequest) throws -> (HTTPURLResponse, Data)) = { _ in
        fatalError("MockURLProtocol.requestHandler not set")
    }
    /// Captures the most recent request, including the body. URLProtocol strips
    /// `httpBody` on the original `URLRequest`, so we restore it via
    /// `httpBodyStream` before storing.
    nonisolated(unsafe) static var lastRequest: URLRequest?

    static func reset() {
        requestHandler = { _ in fatalError("MockURLProtocol.requestHandler not set") }
        lastRequest = nil
    }

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }

    override func startLoading() {
        var captured = request
        if captured.httpBody == nil, let stream = captured.httpBodyStream {
            captured.httpBody = readBodyData(from: stream)
        }
        Self.lastRequest = captured

        do {
            let (response, data) = try Self.requestHandler(request)
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: data)
            client?.urlProtocolDidFinishLoading(self)
        } catch {
            client?.urlProtocol(self, didFailWithError: error)
        }
    }

    override func stopLoading() {}

    private func readBodyData(from stream: InputStream) -> Data {
        stream.open(); defer { stream.close() }
        var data = Data()
        let bufferSize = 1024
        let buffer = UnsafeMutablePointer<UInt8>.allocate(capacity: bufferSize)
        defer { buffer.deallocate() }
        while stream.hasBytesAvailable {
            let read = stream.read(buffer, maxLength: bufferSize)
            if read <= 0 { break }
            data.append(buffer, count: read)
        }
        return data
    }
}

extension URLSession {
    /// Returns a session whose only protocol handler is `MockURLProtocol`.
    static func mock() -> URLSession {
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        return URLSession(configuration: config)
    }
}
