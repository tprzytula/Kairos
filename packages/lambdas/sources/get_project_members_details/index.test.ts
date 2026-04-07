import { handler } from "./index";
import * as database from "./database";

const { mockSend } = vi.hoisted(() => ({
    mockSend: vi.fn(),
}));

vi.mock("./database");
vi.mock("@aws-sdk/client-cognito-identity-provider", () => {
    return {
        CognitoIdentityProviderClient: class {
            send = mockSend;
        },
        AdminGetUserCommand: class {
            constructor(public input: unknown) {}
        },
    };
});

describe('Given the get_project_members_details lambda handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should return member details with Cognito user attributes', async () => {
        vi.mocked(database.getProjectMembers).mockResolvedValue([
            { projectId: "test-project", userId: "user-1", role: "owner", joinedAt: 1000 },
            { projectId: "test-project", userId: "user-2", role: "member", joinedAt: 2000 },
        ] as any);

        mockSend
            .mockResolvedValueOnce({
                UserAttributes: [
                    { Name: "name", Value: "John Doe" },
                    { Name: "given_name", Value: "John" },
                    { Name: "picture", Value: "https://example.com/john.jpg" },
                ],
            })
            .mockResolvedValueOnce({
                UserAttributes: [
                    { Name: "name", Value: "Jane Smith" },
                    { Name: "given_name", Value: "Jane" },
                ],
            });

        const result = await handler({
            headers: { "X-Project-ID": "test-project" },
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(200);

        const body = JSON.parse(result.body);
        expect(body).toEqual([
            {
                userId: "user-1",
                name: "John Doe",
                givenName: "John",
                avatar: "https://example.com/john.jpg",
                role: "owner",
            },
            {
                userId: "user-2",
                name: "Jane Smith",
                givenName: "Jane",
                avatar: undefined,
                role: "member",
            },
        ]);
    });

    it('should handle Cognito errors gracefully', async () => {
        vi.mocked(database.getProjectMembers).mockResolvedValue([
            { projectId: "test-project", userId: "user-1", role: "owner", joinedAt: 1000 },
        ] as any);

        mockSend.mockRejectedValueOnce(new Error("Cognito error"));

        const result = await handler({
            headers: { "X-Project-ID": "test-project" },
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(200);

        const body = JSON.parse(result.body);
        expect(body).toEqual([
            {
                userId: "user-1",
                name: "Unknown",
                givenName: undefined,
                avatar: undefined,
                role: "owner",
            },
        ]);
    });
});
