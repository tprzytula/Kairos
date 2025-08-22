import { handler } from "./index";
import { query } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb/enums";
import { IProject, IProjectMember, ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  DynamoDBTable: {
    PROJECT_MEMBERS: "ProjectMembers",
    PROJECTS: "Projects",
  },
  DynamoDBIndex: {
    PROJECTS_INVITE_CODE: "InviteCodeIndex",
  },
  query: jest.fn(),
}));

describe("Given the get_project_invite_info lambda handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("When invite code is not provided", () => {
    it("should return status 400", async () => {
      const result = await runHandler({ inviteCode: null });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe("Invite code is required");
    });
  });

  describe("When invite code is invalid", () => {
    it("should return status 404", async () => {
      jest.mocked(query).mockResolvedValue([]);

      const result = await runHandler({ inviteCode: "INVALID" });

      expect(result.statusCode).toBe(404);
      expect(result.body).toBe("Invalid invite code");

      expect(query).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECTS,
        indexName: DynamoDBIndex.PROJECTS_INVITE_CODE,
        attributes: {
          inviteCode: "INVALID",
        },
      });
    });
  });

  describe("When invite code is valid", () => {
    it("should return project invite information", async () => {
      const mockProject: IProject = {
        id: "project-1",
        name: "Awesome Project",
        ownerId: "user-456",
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: "ABC123",
        maxMembers: 10,
      };

      const mockMembers: IProjectMember[] = [
        {
          projectId: "project-1",
          userId: "user-456",
          role: ProjectRole.OWNER,
          joinedAt: 1234567890,
        },
        {
          projectId: "project-1",
          userId: "user-789",
          role: ProjectRole.MEMBER,
          joinedAt: 1234567900,
        },
      ];

      jest.mocked(query)
        .mockResolvedValueOnce([mockProject])
        .mockResolvedValueOnce(mockMembers);

      const result = await runHandler({ inviteCode: "abc123" }); // Test case insensitive

      expect(result.statusCode).toBe(200);
      const inviteInfo = JSON.parse(result.body);
      
      expect(inviteInfo).toEqual({
        projectId: "project-1",
        projectName: "Awesome Project",
        ownerId: "user-456",
        memberCount: 2,
        maxMembers: 10,
      });

      expect(query).toHaveBeenNthCalledWith(1, {
        tableName: DynamoDBTable.PROJECTS,
        indexName: DynamoDBIndex.PROJECTS_INVITE_CODE,
        attributes: {
          inviteCode: "ABC123",
        },
      });

      expect(query).toHaveBeenNthCalledWith(2, {
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        attributes: {
          projectId: "project-1",
        },
      });
    });

    it("should throw error when project has no maxMembers", async () => {
      const mockProject: IProject = {
        id: "project-1",
        name: "Simple Project",
        ownerId: "user-456",
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: "XYZ789",
      };

      const mockMembers: IProjectMember[] = [
        {
          projectId: "project-1",
          userId: "user-456",
          role: ProjectRole.OWNER,
          joinedAt: 1234567890,
        },
      ];

      jest.mocked(query)
        .mockResolvedValueOnce([mockProject])
        .mockResolvedValueOnce(mockMembers);

      const result = await runHandler({ inviteCode: "XYZ789" });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("Failed to retrieve project information");
    });

    it("should throw error when project has no owner", async () => {
      const mockProject: IProject = {
        id: "project-1",
        name: "Orphaned Project",
        ownerId: "user-456",
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: "DEF456",
      };

      const mockMembers: IProjectMember[] = [
        {
          projectId: "project-1",
          userId: "user-789",
          role: ProjectRole.MEMBER,
          joinedAt: 1234567900,
        },
      ];

      jest.mocked(query)
        .mockResolvedValueOnce([mockProject])
        .mockResolvedValueOnce(mockMembers);

      const result = await runHandler({ inviteCode: "DEF456" });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("Failed to retrieve project information");
    });
  });

  describe("When database operation fails", () => {
    it("should return status 500", async () => {
      jest.mocked(query).mockRejectedValue(new Error("Database error"));

      const result = await runHandler({ inviteCode: "ABC123" });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("Failed to retrieve project information");
    });
  });

  describe("When project query succeeds but members query fails", () => {
    it("should return status 500", async () => {
      const mockProject: IProject = {
        id: "project-1",
        name: "Project",
        ownerId: "user-456",
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: "ABC123",
      };

      jest.mocked(query)
        .mockResolvedValueOnce([mockProject])
        .mockRejectedValueOnce(new Error("Members query failed"));

      const result = await runHandler({ inviteCode: "ABC123" });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("Failed to retrieve project information");
    });
  });
});

interface MockEvent {
  inviteCode: string | null;
}

const runHandler = async ({ inviteCode }: MockEvent) => {
  const pathParameters = inviteCode ? { inviteCode } : null;
  return await handler({ pathParameters } as any, {} as any, {} as any);
};
