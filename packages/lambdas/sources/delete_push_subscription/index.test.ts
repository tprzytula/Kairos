import { handler } from "./index";
import { DynamoDBTable, deleteItem } from "@kairos-lambdas-libs/dynamodb";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
  deleteItem: jest.fn(),
}));

describe("delete_push_subscription Lambda", () => {
  const mockUserId = "test-user-123";
  const mockEndpoint = "https://fcm.googleapis.com/fcm/send/test-endpoint";

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe("when user is not authenticated", () => {
    it("should return 401 status", async () => {
      const event = { 
        queryStringParameters: { endpoint: mockEndpoint },
        headers: { "Authorization": "Bearer invalid-token" }
      } as any;

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(401);
      expect(response.body).toContain("User authentication required");
    });
  });

  describe("when endpoint parameter is missing", () => {
    it("should return 400 status for null queryStringParameters", async () => {
      const event = {
        queryStringParameters: null,
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing endpoint parameter");
    });

    it("should return 400 status for missing endpoint", async () => {
      const event = {
        queryStringParameters: {},
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(400);
      expect(response.body).toContain("Missing endpoint parameter");
    });
  });

  describe("when request is valid", () => {
    it("should delete push subscription successfully", async () => {
      const event = {
        queryStringParameters: { endpoint: encodeURIComponent(mockEndpoint) },
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;

      jest.mocked(deleteItem).mockResolvedValue({ $metadata: { httpStatusCode: 200 } });

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain('"success":true');
      expect(deleteItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PUSH_SUBSCRIPTIONS,
        key: {
          userId: mockUserId,
          endpoint: mockEndpoint,
        },
      });
    });

    it("should handle URL-encoded endpoints", async () => {
      const encodedEndpoint = encodeURIComponent(mockEndpoint);
      const event = {
        queryStringParameters: { endpoint: encodedEndpoint },
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;

      jest.mocked(deleteItem).mockResolvedValue({ $metadata: { httpStatusCode: 200 } });

      const response = await handler(event, {} as any, {} as any);
      expect(deleteItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PUSH_SUBSCRIPTIONS,
        key: {
          userId: mockUserId,
          endpoint: mockEndpoint,
        },
      });
    });

    it("should handle DynamoDB errors gracefully", async () => {
      const event = {
        queryStringParameters: { endpoint: mockEndpoint },
        requestContext: {
          authorizer: {
            claims: {
              sub: mockUserId
            }
          }
        }
      } as any;

      jest.mocked(deleteItem).mockRejectedValue(new Error("DynamoDB connection failed"));

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(500);
      expect(response.body).toContain("Failed to delete push subscription");
      expect(console.error).toHaveBeenCalledWith(
        "Failed to delete push subscription:",
        expect.any(Error)
      );
    });
  });
});
