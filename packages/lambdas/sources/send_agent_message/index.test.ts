import { handler } from "./index";

describe("send_agent_message Lambda", () => {
  const mockUserId = "test-user-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when user is not authenticated", () => {
    it("should return 401 status", async () => {
      const event = {
        body: JSON.stringify({ message: "hello" }),
        headers: { Authorization: "Bearer invalid-token" },
      } as any;

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(401);
      expect(response.body).toContain("User not authenticated");
    });
  });

  describe("when message is missing", () => {
    it("should return 400 when body is null", async () => {
      const event = {
        body: null,
        requestContext: {
          authorizer: {
            claims: { sub: mockUserId },
          },
        },
      } as any;

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing required field: message");
    });

    it("should return 400 when message field is absent", async () => {
      const event = {
        body: JSON.stringify({ other: "field" }),
        requestContext: {
          authorizer: {
            claims: { sub: mockUserId },
          },
        },
      } as any;

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing required field: message");
    });
  });

  describe("when request is valid", () => {
    it("should echo the message back", async () => {
      const event = {
        body: JSON.stringify({ message: "hello world" }),
        requestContext: {
          authorizer: {
            claims: { sub: mockUserId },
          },
        },
      } as any;

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain('"message":"hello world"');
    });
  });
});
