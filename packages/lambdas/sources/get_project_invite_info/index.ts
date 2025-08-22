import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, DynamoDBIndex, query } from "@kairos-lambdas-libs/dynamodb";
import { IProjectInviteInfo, ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async (event: AuthenticatedEvent) => {
  const { inviteCode } = event.pathParameters ?? {};
  
  if (!inviteCode) {
    return createResponse({
      statusCode: 400,
      message: "Invite code is required",
    });
  }

  try {
    const projectsWithCode = await query({
      tableName: DynamoDBTable.PROJECTS,
      indexName: DynamoDBIndex.PROJECTS_INVITE_CODE,
      attributes: {
        inviteCode: inviteCode.toUpperCase(),
      },
    });

    if (projectsWithCode.length === 0) {
      return createResponse({
        statusCode: 404,
        message: "Invalid invite code",
      });
    }

    const [project] = projectsWithCode;
    const { id: projectId, name: projectName, maxMembers } = project;

    const projectMembers = await query({
      tableName: DynamoDBTable.PROJECT_MEMBERS,
      indexName: DynamoDBIndex.PROJECT_MEMBERS_PROJECT,
      attributes: {
        projectId,
      },
    });

    const owner = projectMembers.find(member => member.role === ProjectRole.OWNER);
    
    if (!owner) {
      throw new Error(`Data integrity error: Project ${projectId} has no owner`);
    }
    
    if (!maxMembers) {
      throw new Error(`Data integrity error: Project ${projectId} has no maxMembers defined`);
    }
    
    const { userId: ownerId } = owner;
    
    const inviteInfo: IProjectInviteInfo = {
      projectId,
      projectName,
      ownerId,
      memberCount: projectMembers.length,
      maxMembers,
    };

    return createResponse({
      statusCode: 200,
      message: inviteInfo,
    });
  } catch (error) {
    console.error("Failed to get project invite info:", error);
    return createResponse({
      statusCode: 500,
      message: "Failed to retrieve project information",
    });
  }
});