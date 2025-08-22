import { handler } from "./index";
import { getBody } from "./body";
import { generateInviteCode, validateProjectLimit } from "./utils";
import { query, putItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable } from "@kairos-lambdas-libs/dynamodb/enums";
import { ICreateProjectRequestBody } from "./body/types";
import { ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";

jest.mock("./body", () => ({
  getBody: jest.fn(),
}));

jest.mock("./utils", () => ({
  generateInviteCode: jest.fn(),
  validateProjectLimit: jest.fn(),
}));

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  DynamoDBTable: {
    PROJECT_MEMBERS: "ProjectMembers",
    PROJECTS: "Projects",
  },
  DynamoDBIndex: {
    PROJECT_MEMBERS_USER_PROJECTS: "UserProjectsIndex",
  },
  query: jest.fn(),
  putItem: jest.fn(),
}));

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn(() => "uuid-1234"),
}));

describe("Given the create_project lambda handler", () => {
  beforeEach(() => {
    jest.mocked(generateInviteCode).mockReturnValue("ABC123");
    jest.mocked(validateProjectLimit).mockResolvedValue(true);
    jest.mocked(query).mockResolvedValue([]);
    jest.mocked(putItem).mockResolvedValue({
      $metadata: {},
      Attributes: undefined,
      ConsumedCapacity: undefined,
      ItemCollectionMetrics: undefined,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("When user is not authenticated", () => {
    it("should return status 401", async () => {
      const result = await runHandler({ userId: null, body: null });

      expect(result.statusCode).toBe(401);
      expect(result.body).toBe("User not authenticated");
    });
  });

  describe("When body is invalid", () => {
    it("should return status 400", async () => {
      jest.mocked(getBody).mockReturnValue(null);

      const result = await runHandler({ userId: "user-123", body: "invalid" });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Invalid request body. Name is required.");
    });
  });

  describe("When user has reached project limit", () => {
    it("should return status 400", async () => {
      jest.mocked(getBody).mockReturnValue(EXAMPLE_PROJECT_REQUEST);
      jest.mocked(validateProjectLimit).mockResolvedValue(false);

      const result = await runHandler({ userId: "user-123", body: JSON.stringify(EXAMPLE_PROJECT_REQUEST) });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Maximum number of projects reached (5 projects per user).");
    });
  });

  describe("When creating a personal project", () => {
    it("should create project with user ID as project ID", async () => {
      const personalProjectRequest: ICreateProjectRequestBody = {
        name: "My Personal Project",
        isPersonal: true,
      };

      jest.mocked(getBody).mockReturnValue(personalProjectRequest);

      const result = await runHandler({ userId: "user-123", body: JSON.stringify(personalProjectRequest) });

      expect(result.statusCode).toBe(201);
      const response = JSON.parse(result.body);
      
      expect(response.project.id).toBe("user-123");
      expect(response.project.name).toBe("My Personal Project");
      expect(response.project.isPersonal).toBe(true);
      expect(response.project.inviteCode).toBeUndefined();
      expect(response.userRole).toBe(ProjectRole.OWNER);

      expect(putItem).toHaveBeenCalledTimes(2);
      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECTS,
        item: expect.objectContaining({
          id: "user-123",
          name: "My Personal Project",
          ownerId: "user-123",
          isPersonal: true,
          inviteCode: undefined,
        }),
      });
    });
  });

  describe("When creating a shared project", () => {
    it("should create project with generated UUID and invite code", async () => {
      jest.mocked(getBody).mockReturnValue(EXAMPLE_PROJECT_REQUEST);

      const result = await runHandler({ userId: "user-123", body: JSON.stringify(EXAMPLE_PROJECT_REQUEST) });

      expect(result.statusCode).toBe(201);
      const response = JSON.parse(result.body);
      
      expect(response.project.id).toBe("uuid-1234");
      expect(response.project.name).toBe("Shared Project");
      expect(response.project.isPersonal).toBe(false);
      expect(response.project.inviteCode).toBe("ABC123");
      expect(response.userRole).toBe(ProjectRole.OWNER);

      expect(putItem).toHaveBeenCalledTimes(2);
      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECTS,
        item: expect.objectContaining({
          id: "uuid-1234",
          name: "Shared Project",
          ownerId: "user-123",
          isPersonal: false,
          inviteCode: "ABC123",
        }),
      });
    });

    it("should create project member entry for owner", async () => {
      jest.mocked(getBody).mockReturnValue(EXAMPLE_PROJECT_REQUEST);

      await runHandler({ userId: "user-123", body: JSON.stringify(EXAMPLE_PROJECT_REQUEST) });

      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        item: expect.objectContaining({
          projectId: "uuid-1234",
          userId: "user-123",
          role: ProjectRole.OWNER,
        }),
      });
    });
  });

  describe("When database operation fails", () => {
    it("should return status 500", async () => {
      jest.mocked(getBody).mockReturnValue(EXAMPLE_PROJECT_REQUEST);
      jest.mocked(putItem).mockRejectedValue(new Error("Database error"));

      const result = await runHandler({ userId: "user-123", body: JSON.stringify(EXAMPLE_PROJECT_REQUEST) });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("Failed to create project");
    });
  });

  describe("When checking existing projects fails", () => {
    it("should return status 500", async () => {
      jest.mocked(getBody).mockReturnValue(EXAMPLE_PROJECT_REQUEST);
      jest.mocked(query).mockRejectedValue(new Error("Query error"));

      const result = await runHandler({ userId: "user-123", body: JSON.stringify(EXAMPLE_PROJECT_REQUEST) });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("Failed to create project");
    });
  });
});

const EXAMPLE_PROJECT_REQUEST: ICreateProjectRequestBody = {
  name: "Shared Project",
  isPersonal: false,
};

interface MockEvent {
  userId: string | null;
  body: string | null;
}

const runHandler = async ({ userId, body }: MockEvent) => {
  const event = userId ? {
    requestContext: {
      authorizer: {
        claims: {
          sub: userId
        }
      }
    },
    body
  } : { body };
  
  return await handler(event as any, {} as any, {} as any);
};
