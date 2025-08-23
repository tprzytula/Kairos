import { handler } from "./index";
import { putItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable } from "@kairos-lambdas-libs/dynamodb/enums";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  DynamoDBTable: {
    USER_PREFERENCES: "UserPreferences",
  },
  putItem: jest.fn(),
}));

describe("Given the update_user_preferences lambda handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("When user is not authenticated", () => {
    it("should return status 401", async () => {
      const result = await runHandler({ 
        userId: null, 
        body: { currentProjectId: "project-123" } 
      });

      expect(result.statusCode).toBe(401);
      expect(result.body).toBe("User not authenticated");
    });
  });

  describe("When request body is invalid", () => {
    it("should return status 400 for null body", async () => {
      const result = await runHandler({ 
        userId: "user-123", 
        body: null 
      });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Invalid request body");
    });

    it("should return status 400 for invalid JSON", async () => {
      const result = await runHandler({ 
        userId: "user-123", 
        rawBody: "invalid json" 
      });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Invalid request body");
    });

    it("should return status 400 for empty currentProjectId", async () => {
      const result = await runHandler({ 
        userId: "user-123", 
        body: { currentProjectId: "" } 
      });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Invalid request body");
    });
  });

  describe("When request is valid", () => {
    it("should update preferences and return success", async () => {
      jest.mocked(putItem).mockResolvedValue(undefined);

      const result = await runHandler({ 
        userId: "user-123", 
        body: { currentProjectId: "project-456" } 
      });

      expect(result.statusCode).toBe(200);
      const preferences = JSON.parse(result.body);
      
      expect(preferences.userId).toBe("user-123");
      expect(preferences.currentProjectId).toBe("project-456");
      expect(preferences.lastUpdated).toBeDefined();
      expect(typeof preferences.lastUpdated).toBe("number");

      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.USER_PREFERENCES,
        item: {
          userId: "user-123",
          currentProjectId: "project-456",
          lastUpdated: expect.any(Number),
        },
      });
    });

    it("should handle undefined currentProjectId", async () => {
      jest.mocked(putItem).mockResolvedValue(undefined);

      const result = await runHandler({ 
        userId: "user-123", 
        body: {} 
      });

      expect(result.statusCode).toBe(200);
      const preferences = JSON.parse(result.body);
      
      expect(preferences.userId).toBe("user-123");
      expect(preferences.currentProjectId).toBeUndefined();
      expect(preferences.lastUpdated).toBeDefined();

      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.USER_PREFERENCES,
        item: {
          userId: "user-123",
          currentProjectId: undefined,
          lastUpdated: expect.any(Number),
        },
      });
    });

    it("should return status 500 when database operation fails", async () => {
      jest.mocked(putItem).mockRejectedValue(new Error("Database error"));

      const result = await runHandler({ 
        userId: "user-123", 
        body: { currentProjectId: "project-456" } 
      });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("Failed to update user preferences");
    });
  });
});

interface MockEvent {
  userId: string | null;
  body?: any;
  rawBody?: string;
}

const runHandler = async ({ userId, body, rawBody }: MockEvent) => {
  const event = userId ? {
    requestContext: {
      authorizer: {
        claims: {
          sub: userId
        }
      }
    },
    body: rawBody || (body ? JSON.stringify(body) : null)
  } : {
    body: rawBody || (body ? JSON.stringify(body) : null)
  };
  
  return await handler(event as any, {} as any, {} as any);
};
