import { handler } from "./index";
import { getBody } from "./body";
import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { IRequestBody } from "./body/types";

jest.mock("./body", () => ({
  getBody: jest.fn(),
}));

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
  putItem: jest.fn(),
}));

describe("save_push_subscription Lambda", () => {
  const mockUserId = "test-user-123";
  const mockRequestBody: IRequestBody = {
    endpoint: "https://fcm.googleapis.com/fcm/send/test-endpoint",
    keys: {
      p256dh: "test-p256dh-key",
      auth: "test-auth-key",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe("when user is not authenticated", () => {
    it("should return 401 status", async () => {
      const event = { 
        body: null,
        headers: { "Authorization": "Bearer invalid-token" }
      } as any;

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(401);
      expect(response.body).toContain("User authentication required");
    });
  });

  describe("when request body is invalid", () => {
    it("should return 400 status for null body", async () => {
      const event = { 
        body: null,
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;
      jest.mocked(getBody).mockReturnValue(null);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Invalid request body");
    });

    it("should return 400 status for missing endpoint", async () => {
      const event = { 
        body: JSON.stringify({}),
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;
      jest.mocked(getBody).mockReturnValue({ endpoint: "", keys: { p256dh: "test", auth: "test" } });

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing required subscription fields");
    });

    it("should return 400 status for missing keys", async () => {
      const event = { 
        body: JSON.stringify({}),
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;
      jest.mocked(getBody).mockReturnValue({ endpoint: "https://test.com", keys: { p256dh: "", auth: "test" } });

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing required subscription fields");
    });
  });

  describe("when request is valid", () => {
    it("should save push subscription successfully", async () => {
      const event = {
        body: JSON.stringify(mockRequestBody),
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;

      jest.mocked(getBody).mockReturnValue(mockRequestBody);
      jest.mocked(putItem).mockResolvedValue({ $metadata: { httpStatusCode: 200 } });

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(201);
      expect(response.body).toContain('"success":true');
      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PUSH_SUBSCRIPTIONS,
        item: {
          userId: mockUserId,
          endpoint: mockRequestBody.endpoint,
          keys: mockRequestBody.keys,
          createdAt: expect.any(Number),
        },
      });
    });

    it("should handle DynamoDB errors gracefully", async () => {
      const event = {
        body: JSON.stringify(mockRequestBody),
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;

      jest.mocked(getBody).mockReturnValue(mockRequestBody);
      jest.mocked(putItem).mockRejectedValue(new Error("DynamoDB connection failed"));

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(500);
      expect(response.body).toContain("Failed to save push subscription");
      expect(console.error).toHaveBeenCalledWith(
        "Failed to save push subscription:",
        expect.any(Error)
      );
    });
  });
});
