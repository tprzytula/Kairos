import { handler } from "./index";
import { getBody } from "./body";
import { query, getItem, putItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb/enums";
import { IProject, IProjectMember, ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";
import { IJoinProjectRequestBody } from "./body/types";

jest.mock("./body", () => ({
  getBody: jest.fn(),
}));

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  DynamoDBTable: {
    PROJECT_MEMBERS: "ProjectMembers",
    PROJECTS: "Projects",
  },
  DynamoDBIndex: {
    PROJECTS_INVITE_CODE: "InviteCodeIndex",
    PROJECT_MEMBERS_USER_PROJECTS: "UserProjectsIndex",
  },
  query: jest.fn(),
  getItem: jest.fn(),
  putItem: jest.fn(),
}));

describe("Given the join_project lambda handler", () => {
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
      expect(result.body).toBe("Invalid request body. Invite code is required.");
    });
  });

  describe("When invite code is invalid", () => {
    it("should return status 404", async () => {
      jest.mocked(getBody).mockReturnValue({ inviteCode: "INVALID" });
      jest.mocked(query).mockResolvedValue([]);

      const result = await runHandler({ userId: "user-123", body: JSON.stringify({ inviteCode: "INVALID" }) });

      expect(result.statusCode).toBe(404);
      expect(result.body).toBe("Invalid invite code. Project not found.");

      expect(query).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECTS,
        indexName: DynamoDBIndex.PROJECTS_INVITE_CODE,
        attributes: {
          inviteCode: "INVALID",
        },
      });
    });
  });

  describe("When trying to join personal project", () => {
    it("should return status 400", async () => {
      const personalProject: IProject = {
        id: "user-456",
        name: "Personal Project",
        ownerId: "user-456",
        createdAt: 1234567890,
        isPersonal: true,
      };

      jest.mocked(getBody).mockReturnValue({ inviteCode: "ABC123" });
      jest.mocked(query).mockResolvedValue([personalProject]);

      const result = await runHandler({ userId: "user-123", body: JSON.stringify({ inviteCode: "ABC123" }) });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Cannot join personal projects.");
    });
  });

  describe("When user is already a member", () => {
    it("should return status 409", async () => {
      const sharedProject: IProject = {
        id: "project-1",
        name: "Shared Project",
        ownerId: "user-456",
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: "ABC123",
      };

      const existingMembership: IProjectMember = {
        projectId: "project-1",
        userId: "user-123",
        role: ProjectRole.MEMBER,
        joinedAt: 1234567890,
      };

      jest.mocked(getBody).mockReturnValue({ inviteCode: "ABC123" });
      jest.mocked(query).mockResolvedValue([sharedProject]);
      jest.mocked(getItem).mockResolvedValue(existingMembership);

      const result = await runHandler({ userId: "user-123", body: JSON.stringify({ inviteCode: "ABC123" }) });

      expect(result.statusCode).toBe(409);
      expect(result.body).toBe("You are already a member of this project.");

      expect(getItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        item: {
          projectId: "project-1",
          userId: "user-123",
        },
      });
    });
  });

  describe("When user has reached project limit", () => {
    it("should return status 400", async () => {
      const sharedProject: IProject = {
        id: "project-1",
        name: "Shared Project",
        ownerId: "user-456",
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: "ABC123",
      };

      // Mock 5 existing projects for the user
      const userProjects = Array.from({ length: 5 }, (_, i) => ({
        projectId: `project-${i}`,
        userId: "user-123",
        role: ProjectRole.MEMBER as const,
        joinedAt: 1234567890,
      }));

      jest.mocked(getBody).mockReturnValue({ inviteCode: "ABC123" });
      jest.mocked(query)
        .mockResolvedValueOnce([sharedProject])
        .mockResolvedValueOnce(userProjects);
      jest.mocked(getItem).mockResolvedValue(null);

      const result = await runHandler({ userId: "user-123", body: JSON.stringify({ inviteCode: "ABC123" }) });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Maximum number of projects reached (5 projects per user).");
    });
  });

  describe("When project is at maximum capacity", () => {
    it("should return status 400", async () => {
      const sharedProject: IProject = {
        id: "project-1",
        name: "Shared Project",
        ownerId: "user-456",
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: "ABC123",
      };

      // Mock 5 existing members in the project
      const projectMembers = Array.from({ length: 5 }, (_, i) => ({
        projectId: "project-1",
        userId: `user-${i}`,
        role: ProjectRole.MEMBER as const,
        joinedAt: 1234567890,
      }));

      jest.mocked(getBody).mockReturnValue({ inviteCode: "ABC123" });
      jest.mocked(query)
        .mockResolvedValueOnce([sharedProject])
        .mockResolvedValueOnce([]) // User has no projects
        .mockResolvedValueOnce(projectMembers); // Project is full
      jest.mocked(getItem).mockResolvedValue(null);

      const result = await runHandler({ userId: "user-123", body: JSON.stringify({ inviteCode: "ABC123" }) });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Project is at maximum capacity.");
    });
  });

  describe("When joining successfully", () => {
    it("should create membership and return project with user role", async () => {
      const sharedProject: IProject = {
        id: "project-1",
        name: "Shared Project",
        ownerId: "user-456",
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: "ABC123",
      };

      jest.mocked(getBody).mockReturnValue({ inviteCode: "ABC123" });
      jest.mocked(query)
        .mockResolvedValueOnce([sharedProject])
        .mockResolvedValueOnce([]) // User has no projects
        .mockResolvedValueOnce([]); // Project has no members
      jest.mocked(getItem).mockResolvedValue(null);
      jest.mocked(putItem).mockResolvedValue(undefined);

      const result = await runHandler({ userId: "user-123", body: JSON.stringify({ inviteCode: "ABC123" }) });

      expect(result.statusCode).toBe(201);
      const response = JSON.parse(result.body);
      
      expect(response.project).toEqual(sharedProject);
      expect(response.userRole).toBe(ProjectRole.MEMBER);

      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        item: expect.objectContaining({
          projectId: "project-1",
          userId: "user-123",
          role: ProjectRole.MEMBER,
          invitedBy: "user-456",
        }),
      });
    });
  });

  describe("When database operation fails", () => {
    it("should return status 500", async () => {
      jest.mocked(getBody).mockReturnValue({ inviteCode: "ABC123" });
      jest.mocked(query).mockRejectedValue(new Error("Database error"));

      const result = await runHandler({ userId: "user-123", body: JSON.stringify({ inviteCode: "ABC123" }) });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("Failed to join project");
    });
  });
});

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
