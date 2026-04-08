import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { middleware, AuthenticatedEvent } from '@kairos-lambdas-libs/middleware';
import { createResponse } from '@kairos-lambdas-libs/response';
import { getMembership, getProject, deleteProjectMembership } from './database';
import { validateMembershipExists, validateNotOwner, validateNotPersonalProject } from './utils';

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    if (!event.userId) {
      return createResponse({
        statusCode: 401,
        message: 'User not authenticated',
      });
    }

    if (!event.projectId) {
      return createResponse({
        statusCode: 400,
        message: 'Project ID is required.',
      });
    }

    try {
      const [membership, project] = await Promise.all([
        getMembership(event.projectId, event.userId),
        getProject(event.projectId),
      ]);

      const membershipError = validateMembershipExists(membership);
      if (membershipError) {
        return createResponse({
          statusCode: 404,
          message: membershipError,
        });
      }

      const personalError = validateNotPersonalProject(project);
      if (personalError) {
        return createResponse({
          statusCode: 400,
          message: personalError,
        });
      }

      const ownerError = validateNotOwner(membership!);
      if (ownerError) {
        return createResponse({
          statusCode: 403,
          message: ownerError,
        });
      }

      await deleteProjectMembership(event.projectId, event.userId);

      return createResponse({
        statusCode: 200,
        message: 'Successfully left the project.',
      });
    } catch (error) {
      console.error('Failed to leave project:', error);
      return createResponse({
        statusCode: 500,
        message: 'Failed to leave project',
      });
    }
  }
);
