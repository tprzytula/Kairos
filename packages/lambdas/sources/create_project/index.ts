import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, DynamoDBIndex, putItem, query } from "@kairos-lambdas-libs/dynamodb";
import { IProject, IProjectMember, ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";
import { randomUUID } from "node:crypto";
import { getBody } from "./body";
import { generateInviteCode, validateProjectLimit } from "./utils";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async (event: AuthenticatedEvent) => {
  const { userId } = event;
  
  if (!userId) {
    return createResponse({
      statusCode: 401,
      message: "User not authenticated",
    });
  }

  const body = getBody(event.body);
  if (!body) {
    return createResponse({
      statusCode: 400,
      message: "Invalid request body. Name is required.",
    });
  }

  try {
    const { name, isPersonal = false } = body;
    
    const existingMemberships = await query({
      tableName: DynamoDBTable.PROJECT_MEMBERS,
      indexName: DynamoDBIndex.PROJECT_MEMBERS_USER_PROJECTS,
      attributes: {
        userId,
      },
    });

    const isWithinLimit = await validateProjectLimit(existingMemberships.length);
    if (!isWithinLimit) {
      return createResponse({
        statusCode: 400,
        message: "Maximum number of projects reached (5 projects per user).",
      });
    }

    const projectId = isPersonal ? userId : randomUUID();
    const now = Date.now();

    const project: IProject = {
      id: projectId,
      name,
      ownerId: userId,
      createdAt: now,
      isPersonal,
      inviteCode: isPersonal ? undefined : generateInviteCode(),
    };

    const projectMember: IProjectMember = {
      projectId,
      userId,
      role: ProjectRole.OWNER,
      joinedAt: now,
    };

    await Promise.all([
      putItem({
        tableName: DynamoDBTable.PROJECTS,
        item: { ...project },
      }),
      putItem({
        tableName: DynamoDBTable.PROJECT_MEMBERS,
        item: { ...projectMember },
      }),
    ]);

    return createResponse({
      statusCode: 201,
      message: {
        project,
        userRole: ProjectRole.OWNER,
      },
    });
  } catch (error) {
    console.error("Failed to create project:", error);
    return createResponse({
      statusCode: 500,
      message: "Failed to create project",
    });
  }
});
