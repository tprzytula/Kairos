import { handler } from './index';
import { getItem, deleteItem } from '@kairos-lambdas-libs/dynamodb';
import { DynamoDBTable } from '@kairos-lambdas-libs/dynamodb/enums';
import {
  IProject,
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

describe('Given the leave_project lambda handler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('When user is not authenticated', () => {
    it('should return status 401', async () => {
      const result = await runHandler({ userId: null, projectId: 'project-1' });

      expect(result.statusCode).toBe(401);
      expect(result.body).toBe('User not authenticated');
    });
  });

  describe('When project ID is missing', () => {
    it('should return status 400', async () => {
      const result = await runHandler({ userId: 'user-123', projectId: null });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe('Project ID is required.');
    });
  });

  describe('When user is not a member of the project', () => {
    it('should return status 404', async () => {
      vi.mocked(getItem).mockResolvedValue(null);

      const result = await runHandler({ userId: 'user-123', projectId: 'project-1' });

      expect(result.statusCode).toBe(404);
      expect(result.body).toBe('You are not a member of this project.');

      expect(getItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        item: {
          projectId: 'project-1',
          userId: 'user-123',
        },
      });
    });
  });

  describe('When trying to leave a personal project', () => {
    it('should return status 400', async () => {
      const personalProject: IProject = {
        id: 'user-123',
        name: 'Personal Project',
        ownerId: 'user-123',
        createdAt: 1234567890,
        isPersonal: true,
      };

      const membership: IProjectMember = {
        projectId: 'user-123',
        userId: 'user-123',
        role: ProjectRole.OWNER,
        joinedAt: 1234567890,
      };

      vi.mocked(getItem).mockResolvedValueOnce(membership).mockResolvedValueOnce(personalProject);

      const result = await runHandler({ userId: 'user-123', projectId: 'user-123' });

      expect(result.statusCode).toBe(400);
      expect(result.body).toBe('Cannot leave a personal project.');
    });
  });

  describe('When the owner tries to leave', () => {
    it('should return status 403', async () => {
      const sharedProject: IProject = {
        id: 'project-1',
        name: 'Shared Project',
        ownerId: 'user-123',
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: 'ABC123',
      };

      const membership: IProjectMember = {
        projectId: 'project-1',
        userId: 'user-123',
        role: ProjectRole.OWNER,
        joinedAt: 1234567890,
      };

      vi.mocked(getItem).mockResolvedValueOnce(membership).mockResolvedValueOnce(sharedProject);

      const result = await runHandler({ userId: 'user-123', projectId: 'project-1' });

      expect(result.statusCode).toBe(403);
      expect(result.body).toBe('Project owner cannot leave the project.');
    });
  });

  describe('When leaving successfully', () => {
    it('should delete membership and return success', async () => {
      const sharedProject: IProject = {
        id: 'project-1',
        name: 'Shared Project',
        ownerId: 'user-456',
        createdAt: 1234567890,
        isPersonal: false,
        inviteCode: 'ABC123',
      };

      const membership: IProjectMember = {
        projectId: 'project-1',
        userId: 'user-123',
        role: ProjectRole.MEMBER,
        joinedAt: 1234567890,
      };

      vi.mocked(getItem).mockResolvedValueOnce(membership).mockResolvedValueOnce(sharedProject);
      vi.mocked(deleteItem).mockResolvedValue(undefined as never);

      const result = await runHandler({ userId: 'user-123', projectId: 'project-1' });

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe('Successfully left the project.');

      expect(deleteItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        key: {
          projectId: 'project-1',
          userId: 'user-123',
        },
      });
    });
  });

  describe('When database operation fails', () => {
    it('should return status 500', async () => {
      vi.mocked(getItem).mockRejectedValue(new Error('Database error'));

      const result = await runHandler({ userId: 'user-123', projectId: 'project-1' });

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe('Failed to leave project');
    });
  });
});

interface MockEvent {
  userId: string | null;
  projectId: string | null;
}

const runHandler = async ({ userId, projectId }: MockEvent) => {
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
    body: null,
  };

  return await handler(event as any, {} as any, {} as any);
};
