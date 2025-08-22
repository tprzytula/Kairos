import { DynamoDBTable, DynamoDBIndex, putItem, query, getItem } from "@kairos-lambdas-libs/dynamodb";
import { IProject, IProjectMember, ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";

export const findProjectByInviteCode = async (inviteCode: string): Promise<IProject | null> => {
  const projects = await query({
    tableName: DynamoDBTable.PROJECTS,
    indexName: DynamoDBIndex.PROJECTS_INVITE_CODE,
    attributes: {
      inviteCode,
    },
  });

  return projects[0] || null;
};

export const findExistingMembership = async (projectId: string, userId: string): Promise<IProjectMember | null> => {
  return await getItem({
    tableName: DynamoDBTable.PROJECT_MEMBERS,
    item: {
      projectId,
      userId,
    },
  });
};

export const getUserProjects = async (userId: string): Promise<IProjectMember[]> => {
  return await query({
    tableName: DynamoDBTable.PROJECT_MEMBERS,
    indexName: DynamoDBIndex.PROJECT_MEMBERS_USER_PROJECTS,
    attributes: {
      userId,
    },
  });
};

export const getProjectMembers = async (projectId: string): Promise<IProjectMember[]> => {
  return await query({
    tableName: DynamoDBTable.PROJECT_MEMBERS,
    indexName: DynamoDBIndex.PROJECT_MEMBERS_PROJECT,
    attributes: {
      projectId,
    },
  });
};

export const createProjectMembership = async (
  projectId: string,
  userId: string,
  ownerId: string
): Promise<void> => {
  const projectMember: Omit<IProjectMember, 'role' | 'joinedAt' | 'invitedBy'> & {
    role: string;
    joinedAt: number;
    invitedBy: string;
  } = {
    projectId,
    userId,
    role: ProjectRole.MEMBER,
    joinedAt: Date.now(),
    invitedBy: ownerId,
  };

  await putItem({
    tableName: DynamoDBTable.PROJECT_MEMBERS,
    item: {
      ...projectMember,
    },
  });
};
