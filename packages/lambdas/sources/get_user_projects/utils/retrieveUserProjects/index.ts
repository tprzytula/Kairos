import { DynamoDBTable, DynamoDBIndex, query, getItem } from "@kairos-lambdas-libs/dynamodb";
import { IProject, IProjectMember, ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";

export const retrieveUserProjects = async (userId: string): Promise<(IProject & { userRole: ProjectRole })[]> => {
  const projectMemberships = await query({
    tableName: DynamoDBTable.PROJECT_MEMBERS,
    indexName: DynamoDBIndex.PROJECT_MEMBERS_USER_PROJECTS,
    attributes: {
      userId,
    },
  });

  const projectPromises = projectMemberships.map(async (membership: IProjectMember) => {
    try {
      const project = await getItem({
        tableName: DynamoDBTable.PROJECTS,
        item: { id: membership.projectId },
      });

      return project ? { ...project, userRole: membership.role } : null;
    } catch (error) {
      console.warn(`Failed to get project ${membership.projectId}:`, error);
      return null;
    }
  });

  const projectResults = await Promise.all(projectPromises);
  
  return projectResults
    .filter((project): project is IProject & { userRole: ProjectRole } => project !== null);
};
