import { DynamoDBTable, DynamoDBIndex, query } from "@kairos-lambdas-libs/dynamodb";
import { IProjectMember } from "@kairos-lambdas-libs/dynamodb/types/projects";

export const getProjectMembers = async (projectId: string): Promise<IProjectMember[]> => {
  return await query({
    tableName: DynamoDBTable.PROJECT_MEMBERS,
    indexName: DynamoDBIndex.PROJECT_MEMBERS_PROJECT,
    attributes: {
      projectId,
    },
  });
};
