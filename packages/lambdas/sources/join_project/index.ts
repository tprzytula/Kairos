import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";
import { getBody } from "./body";
import {
  findProjectByInviteCode,
  findExistingMembership,
  getUserProjects,
  getProjectMembers,
  createProjectMembership,
} from "./database";
import {
  validateProjectJoinability,
  validateUserProjectLimit,
  validateProjectCapacity,
  validateExistingMembership,
} from "./utils";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async (event: AuthenticatedEvent) => {
  if (!event.userId) {
    return createResponse({
      statusCode: 401,
      message: "User not authenticated",
    });
  }

  const body = getBody(event.body);
  if (!body) {
    return createResponse({
      statusCode: 400,
      message: "Invalid request body. Invite code is required.",
    });
  }

  try {
    const project = await findProjectByInviteCode(body.inviteCode);
    if (!project) {
      return createResponse({
        statusCode: 404,
        message: "Invalid invite code. Project not found.",
      });
    }

    const joinabilityError = validateProjectJoinability(project);
    if (joinabilityError) {
      return createResponse({
        statusCode: 400,
        message: joinabilityError,
      });
    }

    const existingMembership = await findExistingMembership(project.id, event.userId);
    const membershipError = validateExistingMembership(existingMembership);
    if (membershipError) {
      return createResponse({
        statusCode: 409,
        message: membershipError,
      });
    }

    const userProjects = await getUserProjects(event.userId);
    const projectLimitError = validateUserProjectLimit(userProjects);
    if (projectLimitError) {
      return createResponse({
        statusCode: 400,
        message: projectLimitError,
      });
    }

    const projectMembers = await getProjectMembers(project.id);
    const capacityError = validateProjectCapacity(project, projectMembers);
    if (capacityError) {
      return createResponse({
        statusCode: 400,
        message: capacityError,
      });
    }

    await createProjectMembership(project.id, event.userId, project.ownerId);

    return createResponse({
      statusCode: 201,
      message: {
        project,
        userRole: ProjectRole.MEMBER,
      },
    });
  } catch (error) {
    console.error("Failed to join project:", error);
    return createResponse({
      statusCode: 500,
      message: "Failed to join project",
    });
  }
});
