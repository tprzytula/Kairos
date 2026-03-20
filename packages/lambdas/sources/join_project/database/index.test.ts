import { query, getItem, putItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb/enums";
import { ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";
import {
  findProjectByInviteCode,
  findExistingMembership,
  getUserProjects,
  createProjectMembership,
} from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
  DynamoDBTable: {
    PROJECTS: "Projects",
    PROJECT_MEMBERS: "ProjectMembers",
  },
  DynamoDBIndex: {
    PROJECTS_INVITE_CODE: "InviteCodeIndex",
    PROJECT_MEMBERS_USER_PROJECTS: "UserProjectsIndex",
  },
  query: vi.fn(),
  getItem: vi.fn(),
  putItem: vi.fn(),
}));

describe("database functions", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("findProjectByInviteCode", () => {
    it("should return project when found", async () => {
      const mockProject = { id: "project-1", name: "Test Project" };
      vi.mocked(query).mockResolvedValue([mockProject]);

      const result = await findProjectByInviteCode("ABC123");

      expect(result).toEqual(mockProject);
      expect(query).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECTS,
        indexName: DynamoDBIndex.PROJECTS_INVITE_CODE,
        attributes: { inviteCode: "ABC123" },
      });
    });

    it("should return null when no project found", async () => {
      vi.mocked(query).mockResolvedValue([]);

      const result = await findProjectByInviteCode("INVALID");

      expect(result).toBe(null);
    });
  });

  describe("findExistingMembership", () => {
    it("should return membership when found", async () => {
      const mockMembership = { projectId: "project-1", userId: "user-123" };
      vi.mocked(getItem).mockResolvedValue(mockMembership);

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
      vi.mocked(query).mockResolvedValue(mockProjects);

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
      vi.mocked(putItem).mockResolvedValue(undefined);

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
