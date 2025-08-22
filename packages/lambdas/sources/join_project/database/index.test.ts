import { query, getItem, putItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb/enums";
import { ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";
import {
  findProjectByInviteCode,
  findExistingMembership,
  getUserProjects,
  createProjectMembership,
} from "./index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  DynamoDBTable: {
    PROJECTS: "Projects",
    PROJECT_MEMBERS: "ProjectMembers",
  },
  DynamoDBIndex: {
    PROJECTS_INVITE_CODE: "InviteCodeIndex",
    PROJECT_MEMBERS_USER_PROJECTS: "UserProjectsIndex",
  },
  query: jest.fn(),
  getItem: jest.fn(),
  putItem: jest.fn(),
}));

describe("database functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findProjectByInviteCode", () => {
    it("should return project when found", async () => {
      const mockProject = { id: "project-1", name: "Test Project" };
      jest.mocked(query).mockResolvedValue([mockProject]);

      const result = await findProjectByInviteCode("ABC123");

      expect(result).toEqual(mockProject);
      expect(query).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECTS,
        indexName: DynamoDBIndex.PROJECTS_INVITE_CODE,
        attributes: { inviteCode: "ABC123" },
      });
    });

    it("should return null when no project found", async () => {
      jest.mocked(query).mockResolvedValue([]);

      const result = await findProjectByInviteCode("INVALID");

      expect(result).toBe(null);
    });
  });

  describe("findExistingMembership", () => {
    it("should return membership when found", async () => {
      const mockMembership = { projectId: "project-1", userId: "user-123" };
      jest.mocked(getItem).mockResolvedValue(mockMembership);

      const result = await findExistingMembership("project-1", "user-123");

      expect(result).toEqual(mockMembership);
      expect(getItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        item: { projectId: "project-1", userId: "user-123" },
      });
    });
  });

  describe("getUserProjects", () => {
    it("should return user projects", async () => {
      const mockProjects = [{ projectId: "project-1", userId: "user-123" }];
      jest.mocked(query).mockResolvedValue(mockProjects);

      const result = await getUserProjects("user-123");

      expect(result).toEqual(mockProjects);
      expect(query).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        indexName: DynamoDBIndex.PROJECT_MEMBERS_USER_PROJECTS,
        attributes: { userId: "user-123" },
      });
    });
  });

  describe("createProjectMembership", () => {
    it("should create membership with correct data", async () => {
      jest.mocked(putItem).mockResolvedValue(undefined);

      await createProjectMembership("project-1", "user-123", "owner-456");

      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        item: expect.objectContaining({
          projectId: "project-1",
          userId: "user-123",
          role: ProjectRole.MEMBER,
          invitedBy: "owner-456",
          joinedAt: expect.any(Number),
        }),
      });
    });
  });
});
