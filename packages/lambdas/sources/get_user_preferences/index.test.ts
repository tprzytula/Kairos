import { handler } from "./index";
import { getItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable } from "@kairos-lambdas-libs/dynamodb/enums";
import { IUserPreferences } from "@kairos-lambdas-libs/dynamodb/types";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  DynamoDBTable: {
    USER_PREFERENCES: "UserPreferences",
  },
  getItem: jest.fn(),
}));

describe("Given the get_user_preferences lambda handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("When user is not authenticated", () => {
    it("should return status 401", async () => {
      const result = await runHandler({ userId: null });

      expect(result.statusCode).toBe(401);
      expect(result.body).toBe("User not authenticated");
    });
  });

  describe("When user is authenticated", () => {
    describe("And user has no saved preferences", () => {
      it("should return default preferences", async () => {
        jest.mocked(getItem).mockResolvedValue(null);

        const result = await runHandler({ userId: "user-123" });

        expect(result.statusCode).toBe(200);
        const preferences = JSON.parse(result.body);
        
        expect(preferences.userId).toBe("user-123");
        expect(preferences.currentProjectId).toBeUndefined();
        expect(preferences.lastUpdated).toBeDefined();
        expect(typeof preferences.lastUpdated).toBe("number");

        expect(getItem).toHaveBeenCalledWith({
          tableName: DynamoDBTable.USER_PREFERENCES,
          item: { userId: "user-123" },
        });
      });
    });

    describe("And user has saved preferences", () => {
      it("should return saved preferences", async () => {
        const mockPreferences: IUserPreferences = {
          userId: "user-123",
          currentProjectId: "project-456",
          lastUpdated: 1234567890,
        };

        jest.mocked(getItem).mockResolvedValue(mockPreferences);

        const result = await runHandler({ userId: "user-123" });

        expect(result.statusCode).toBe(200);
        const preferences = JSON.parse(result.body);
        
        expect(preferences).toEqual(mockPreferences);

        expect(getItem).toHaveBeenCalledWith({
          tableName: DynamoDBTable.USER_PREFERENCES,
          item: { userId: "user-123" },
        });
      });
    });

    describe("And database query fails", () => {
      it("should return default preferences with status 200", async () => {
        jest.mocked(getItem).mockRejectedValue(new Error("Database error"));

        const result = await runHandler({ userId: "user-123" });

        expect(result.statusCode).toBe(200);
        const preferences = JSON.parse(result.body);
        
        expect(preferences.userId).toBe("user-123");
        expect(preferences.currentProjectId).toBeUndefined();
        expect(preferences.lastUpdated).toBeDefined();
      });
    });
  });
});

interface MockEvent {
  userId: string | null;
}

const runHandler = async ({ userId }: MockEvent) => {
  const event = userId ? {
    requestContext: {
      authorizer: {
        claims: {
          sub: userId
        }
      }
    }
  } : {};
  
  return await handler(event as any, {} as any, {} as any);
};
