import { handler } from './index';
import { getItem, deleteItem } from '@kairos-lambdas-libs/dynamodb';
import { DynamoDBTable } from '@kairos-lambdas-libs/dynamodb/enums';
import {
  IProjectMember,
  ProjectRole,
} from '@kairos-lambdas-libs/dynamodb/types/projects';

vi.mock('@kairos-lambdas-libs/dynamodb', async () => ({
  DynamoDBTable: {
    PROJECT_MEMBERS: 'ProjectMembers',
    PROJECTS: 'Projects',
  },
  getItem: vi.fn(),
  deleteItem: vi.fn(),
}));

describe('Given the remove_project_member lambda handler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('When user is not authenticated', () => {
    it('should return status 401', async () => {
      const result = await runHandler({
        userId: null,
        projectId: 'project-1',
        targetUserId: 'user-456',
      });

      expect(result.statusCode).toBe(401);
      expect(result.body).toBe('User not authenticated');
    });
  });

  describe('When project ID is missing', () => {
    it('should return status 400', async () => {
      const result = await runHandler({
        userId: 'user-123',
        projectId: null,
        targetUserId: 'user-456',
      });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe('Project ID is required.');
    });
  });

  describe('When target user ID is missing', () => {
    it('should return status 400', async () => {
      const result = await runHandler({
        userId: 'user-123',
        projectId: 'project-1',
        targetUserId: null,
      });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe('Target user ID is required.');
    });
  });

  describe('When caller is not the project owner', () => {
    it('should return status 403', async () => {
      const callerMembership: IProjectMember = {
        projectId: 'project-1',
        userId: 'user-123',
        role: ProjectRole.MEMBER,
        joinedAt: 1234567890,
      };

      const targetMembership: IProjectMember = {
        projectId: 'project-1',
        userId: 'user-456',
        role: ProjectRole.MEMBER,
        joinedAt: 1234567890,
      };

      vi.mocked(getItem)
        .mockResolvedValueOnce(callerMembership)
        .mockResolvedValueOnce(targetMembership);

      const result = await runHandler({
        userId: 'user-123',
        projectId: 'project-1',
        targetUserId: 'user-456',
      });

      expect(result.statusCode).toBe(403);
      expect(result.body).toBe('Only the project owner can remove members.');
    });
  });

  describe('When caller is not a member of the project', () => {
    it('should return status 403', async () => {
      vi.mocked(getItem).mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      const result = await runHandler({
        userId: 'user-123',
        projectId: 'project-1',
        targetUserId: 'user-456',
      });

      expect(result.statusCode).toBe(403);
      expect(result.body).toBe('Only the project owner can remove members.');
    });
  });

  describe('When target user is not a member of the project', () => {
    it('should return status 404', async () => {
      const callerMembership: IProjectMember = {
        projectId: 'project-1',
        userId: 'user-123',
        role: ProjectRole.OWNER,
        joinedAt: 1234567890,
      };

      vi.mocked(getItem)
        .mockResolvedValueOnce(callerMembership)
        .mockResolvedValueOnce(null);

      const result = await runHandler({
        userId: 'user-123',
        projectId: 'project-1',
        targetUserId: 'user-456',
      });

      expect(result.statusCode).toBe(404);
      expect(result.body).toBe('The specified user is not a member of this project.');
    });
  });

  describe('When trying to remove the project owner', () => {
    it('should return status 400', async () => {
      const callerMembership: IProjectMember = {
        projectId: 'project-1',
        userId: 'user-123',
        role: ProjectRole.OWNER,
        joinedAt: 1234567890,
      };

      const targetMembership: IProjectMember = {
        projectId: 'project-1',
        userId: 'user-123',
        role: ProjectRole.OWNER,
        joinedAt: 1234567890,
      };

      vi.mocked(getItem)
        .mockResolvedValueOnce(callerMembership)
        .mockResolvedValueOnce(targetMembership);

      const result = await runHandler({
        userId: 'user-123',
        projectId: 'project-1',
        targetUserId: 'user-123',
      });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe('Cannot remove the project owner.');
    });
  });

  describe('When removing a member successfully', () => {
    it('should delete membership and return success', async () => {
      const callerMembership: IProjectMember = {
        projectId: 'project-1',
        userId: 'user-123',
        role: ProjectRole.OWNER,
        joinedAt: 1234567890,
      };

      const targetMembership: IProjectMember = {
        projectId: 'project-1',
        userId: 'user-456',
        role: ProjectRole.MEMBER,
        joinedAt: 1234567890,
      };

      vi.mocked(getItem)
        .mockResolvedValueOnce(callerMembership)
        .mockResolvedValueOnce(targetMembership);
      vi.mocked(deleteItem).mockResolvedValue(undefined as never);

      const result = await runHandler({
        userId: 'user-123',
        projectId: 'project-1',
        targetUserId: 'user-456',
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('Successfully removed member from the project.');

      expect(getItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        item: {
          projectId: 'project-1',
          userId: 'user-123',
        },
      });

      expect(getItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        item: {
          projectId: 'project-1',
          userId: 'user-456',
        },
      });

      expect(deleteItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        key: {
          projectId: 'project-1',
          userId: 'user-456',
        },
      });
    });
  });

  describe('When database operation fails', () => {
    it('should return status 500', async () => {
      vi.mocked(getItem).mockRejectedValue(new Error('Database error'));

      const result = await runHandler({
        userId: 'user-123',
        projectId: 'project-1',
        targetUserId: 'user-456',
      });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe('Failed to remove project member');
    });
  });
});

interface MockEvent {
  userId: string | null;
  projectId: string | null;
  targetUserId: string | null;
}

const runHandler = async ({ userId, projectId, targetUserId }: MockEvent) => {
  const event = {
    ...(userId
      ? {
          requestContext: {
            authorizer: {
              claims: {
                sub: userId,
              },
            },
          },
        }
      : {}),
    headers: projectId ? { 'X-Project-ID': projectId } : {},
    pathParameters: targetUserId ? { userId: targetUserId } : {},
    body: null,
  };

  return await handler(event as any, {} as any, {} as any);
};
