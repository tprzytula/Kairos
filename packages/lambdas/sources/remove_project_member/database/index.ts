import { DynamoDBTable, getItem, deleteItem } from '@kairos-lambdas-libs/dynamodb';
import { IProject, IProjectMember } from '@kairos-lambdas-libs/dynamodb/types/projects';

export const getMembership = async (
  projectId: string,
  userId: string
): Promise<IProjectMember | null> => {
  return await getItem({
    tableName: DynamoDBTable.PROJECT_MEMBERS,
    item: {
      projectId,
      userId,
    },
  });
};

export const getProject = async (projectId: string): Promise<IProject | null> => {
  return await getItem({
    tableName: DynamoDBTable.PROJECTS,
    item: {
      id: projectId,
    },
  });
};

export const deleteProjectMembership = async (projectId: string, userId: string): Promise<void> => {
  await deleteItem({
    tableName: DynamoDBTable.PROJECT_MEMBERS,
    key: {
      projectId,
      userId,
    },
  });
};
