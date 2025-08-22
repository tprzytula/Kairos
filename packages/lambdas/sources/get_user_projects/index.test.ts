import { handler } from "./index";
import { query, getItem } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb/enums";
import { IProject, IProjectMember, ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  DynamoDBTable: {
    PROJECT_MEMBERS: "ProjectMembers",
    PROJECTS: "Projects",
  },
  DynamoDBIndex: {
    PROJECT_MEMBERS_USER_PROJECTS: "UserProjectsIndex",
  },
  query: jest.fn(),
  getItem: jest.fn(),
}));

describe("Given the get_user_projects lambda handler", () => {
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
    describe("And user has no projects", () => {
      it("should return empty array", async () => {
        jest.mocked(query).mockResolvedValue([]);

        const result = await runHandler({ userId: "user-123" });

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual([]);
        expect(query).toHaveBeenCalledWith({
          tableName: DynamoDBTable.PROJECT_MEMBERS,
          indexName: DynamoDBIndex.PROJECT_MEMBERS_USER_PROJECTS,
          attributes: {
            userId: "user-123",
          },
        });
      });
    });

    describe("And user has projects", () => {
      it("should return projects with user roles", async () => {
        const mockMemberships: IProjectMember[] = [
          {
            projectId: "project-1",
            userId: "user-123",
            role: ProjectRole.OWNER,
            joinedAt: 1234567890,
          },
          {
            projectId: "project-2",
            userId: "user-123",
            role: ProjectRole.MEMBER,
            joinedAt: 1234567900,
          },
        ];

        const mockProjects: IProject[] = [
          {
            id: "project-1",
            name: "My Personal Project",
            ownerId: "user-123",
            createdAt: 1234567880,
            isPersonal: true,
          },
          {
            id: "project-2",
            name: "Shared Project",
            ownerId: "user-456",
            createdAt: 1234567890,
            isPersonal: false,
            inviteCode: "ABC123",
          },
        ];

        jest.mocked(query).mockResolvedValue(mockMemberships);
        jest.mocked(getItem)
          .mockResolvedValueOnce(mockProjects[0])
          .mockResolvedValueOnce(mockProjects[1]);

        const result = await runHandler({ userId: "user-123" });

        expect(result.statusCode).toBe(200);
        const returnedProjects = JSON.parse(result.body);
        
        // Should be sorted with personal project first
        expect(returnedProjects).toHaveLength(2);
        expect(returnedProjects[0].id).toBe("project-1");
        expect(returnedProjects[0].userRole).toBe(ProjectRole.OWNER);
        expect(returnedProjects[1].id).toBe("project-2");
        expect(returnedProjects[1].userRole).toBe(ProjectRole.MEMBER);

        expect(getItem).toHaveBeenCalledTimes(2);
        expect(getItem).toHaveBeenCalledWith({
          tableName: DynamoDBTable.PROJECTS,
          item: { id: "project-1" },
        });
        expect(getItem).toHaveBeenCalledWith({
          tableName: DynamoDBTable.PROJECTS,
          item: { id: "project-2" },
        });
      });
    });

    describe("And database query fails", () => {
      it("should return status 500", async () => {
        jest.mocked(query).mockRejectedValue(new Error("Database error"));

        const result = await runHandler({ userId: "user-123" });

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe("Failed to retrieve projects");
      });
    });

    describe("And some projects cannot be retrieved", () => {
      it("should return only successfully retrieved projects", async () => {
        const mockMemberships: IProjectMember[] = [
          {
            projectId: "project-1",
            userId: "user-123",
            role: ProjectRole.OWNER,
            joinedAt: 1234567890,
          },
          {
            projectId: "project-2",
            userId: "user-123",
            role: ProjectRole.MEMBER,
            joinedAt: 1234567900,
          },
        ];

        const mockProject: IProject = {
          id: "project-1",
          name: "My Personal Project",
          ownerId: "user-123",
          createdAt: 1234567880,
          isPersonal: true,
        };

        jest.mocked(query).mockResolvedValue(mockMemberships);
        jest.mocked(getItem)
          .mockResolvedValueOnce(mockProject)
          .mockResolvedValueOnce(null); // Second project not found

        const result = await runHandler({ userId: "user-123" });

        expect(result.statusCode).toBe(200);
        const returnedProjects = JSON.parse(result.body);
        
        expect(returnedProjects).toHaveLength(1);
        expect(returnedProjects[0].id).toBe("project-1");
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
