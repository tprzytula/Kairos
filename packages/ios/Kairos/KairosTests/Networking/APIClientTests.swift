import Foundation
import Testing
@testable import Kairos

@Suite("Given the URLSessionAPIClient")
struct APIClientTests {

    private func makeClient(
        idToken: String? = "id-token",
        accessToken: String? = "access-token",
        projectId: String? = "project-1"
    ) -> URLSessionAPIClient {
        URLSessionAPIClient(
            session: URLSession.mock(),
            baseURL: URL(string: "https://api.example.com/v1")!,
            idTokenProvider: { idToken },
            accessTokenProvider: { accessToken },
            projectIdProvider: { projectId }
        )
    }

    private func okHandler<T: Encodable & Sendable>(_ body: T) -> @Sendable (URLRequest) throws -> (HTTPURLResponse, Data) {
        let data = try! JSONEncoder().encode(body)
        return { request in
            let response = HTTPURLResponse(
                url: request.url!,
                statusCode: 200,
                httpVersion: "HTTP/1.1",
                headerFields: ["Content-Type": "application/json"]
            )!
            return (response, data)
        }
    }

    @Test("when GET is project-scoped, it should send Authorization+X-Project-ID headers and the correct URL")
    func projectScopedGetSendsHeadersAndURL() async throws {
        MockURLProtocol.reset()
        MockURLProtocol.requestHandler = okHandler([Shop]())

        let client = makeClient()
        let _: [Shop] = try await client.get(endpoint: .shops, projectScoped: true)

        let request = try #require(MockURLProtocol.lastRequest)
        #expect(request.httpMethod == "GET")
        #expect(request.url?.absoluteString == "https://api.example.com/v1/shops")
        #expect(request.value(forHTTPHeaderField: "Authorization") == "Bearer id-token")
        #expect(request.value(forHTTPHeaderField: "X-Project-ID") == "project-1")
    }

    @Test("when project ID is missing, it should fall back to legacy-shared-project")
    func projectScopedGetUsesFallbackProjectId() async throws {
        MockURLProtocol.reset()
        MockURLProtocol.requestHandler = okHandler([Shop]())

        let client = makeClient(projectId: nil)
        let _: [Shop] = try await client.get(endpoint: .shops, projectScoped: true)

        let request = try #require(MockURLProtocol.lastRequest)
        #expect(request.value(forHTTPHeaderField: "X-Project-ID") == "legacy-shared-project")
    }

    @Test("when GET is user-scoped, it should send the access token and omit X-Project-ID")
    func userScopedGetUsesAccessTokenAndOmitsProjectHeader() async throws {
        MockURLProtocol.reset()
        MockURLProtocol.requestHandler = okHandler([Project]())

        let client = makeClient()
        let _: [Project] = try await client.get(endpoint: .projects, projectScoped: false)

        let request = try #require(MockURLProtocol.lastRequest)
        #expect(request.value(forHTTPHeaderField: "Authorization") == "Bearer access-token")
        #expect(request.value(forHTTPHeaderField: "X-Project-ID") == nil)
    }

    @Test("when project-scoped and no idToken is available, it should throw .unauthenticated")
    func projectScopedGetThrowsWhenMissingIdToken() async {
        MockURLProtocol.reset()
        MockURLProtocol.requestHandler = okHandler([Shop]())

        let client = makeClient(idToken: nil)
        await #expect(throws: APIError.unauthenticated) {
            let _: [Shop] = try await client.get(endpoint: .shops, projectScoped: true)
        }
    }

    @Test("when user-scoped and no accessToken is available, it should throw .unauthenticated")
    func userScopedGetThrowsWhenMissingAccessToken() async {
        MockURLProtocol.reset()
        MockURLProtocol.requestHandler = okHandler([Project]())

        let client = makeClient(accessToken: nil)
        await #expect(throws: APIError.unauthenticated) {
            let _: [Project] = try await client.get(endpoint: .projects, projectScoped: false)
        }
    }

    @Test("when PUT is called, it should encode the body as JSON and set Content-Type")
    func putSendsJSONBody() async throws {
        MockURLProtocol.reset()
        MockURLProtocol.requestHandler = okHandler(CreatedResource(id: "new-id"))

        let client = makeClient()
        struct CreateShop: Encodable, Sendable { let name: String }
        let response: CreatedResource = try await client.put(
            endpoint: .shops,
            body: CreateShop(name: "Tesco"),
            projectScoped: true
        )

        let request = try #require(MockURLProtocol.lastRequest)
        #expect(request.httpMethod == "PUT")
        #expect(request.value(forHTTPHeaderField: "Content-Type") == "application/json")
        let body = try #require(request.httpBody)
        let json = try JSONSerialization.jsonObject(with: body) as? [String: Any]
        #expect(json?["name"] as? String == "Tesco")
        #expect(response.id == "new-id")
    }

    @Test("when DELETE is called, it should issue a DELETE request and decode no body")
    func deleteIssuesDeleteRequest() async throws {
        MockURLProtocol.reset()
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
            return (response, Data())
        }

        let client = makeClient()
        try await client.delete(endpoint: .shop(id: "abc"), projectScoped: true)

        let request = try #require(MockURLProtocol.lastRequest)
        #expect(request.httpMethod == "DELETE")
        #expect(request.url?.absoluteString == "https://api.example.com/v1/shops/abc")
    }

    @Test("when the response status is non-2xx, it should throw .http with the status and body")
    func nonSuccessStatusThrowsHTTPError() async {
        MockURLProtocol.reset()
        MockURLProtocol.requestHandler = { request in
            let response = HTTPURLResponse(url: request.url!, statusCode: 409, httpVersion: nil, headerFields: nil)!
            return (response, Data("duplicate".utf8))
        }

        let client = makeClient()
        await #expect(throws: APIError.http(status: 409, body: "duplicate")) {
            let _: [Shop] = try await client.get(endpoint: .shops, projectScoped: true)
        }
    }

    @Test("when a query parameter is set, it should appear on the URL")
    func queryParametersAppearOnURL() async throws {
        MockURLProtocol.reset()
        MockURLProtocol.requestHandler = okHandler([GroceryItem]())

        let client = makeClient()
        let _: [GroceryItem] = try await client.get(
            endpoint: .groceryItems(shopId: "shop-7"),
            projectScoped: true
        )

        let request = try #require(MockURLProtocol.lastRequest)
        #expect(request.url?.absoluteString == "https://api.example.com/v1/grocery_list/items?shopId=shop-7")
    }
}
