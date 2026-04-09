import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { middleware, AuthenticatedEvent } from '@kairos-lambdas-libs/middleware';
import { createResponse } from '@kairos-lambdas-libs/response';
import { getMembership, deleteProjectMembership } from './database';
import { validateIsOwner, validateTargetMemberExists, validateTargetIsNotOwner } from './utils';

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

    const targetUserId = event.pathParameters?.userId;

    if (!targetUserId) {
      return createResponse({
        statusCode: 400,
        message: 'Target user ID is required.',
      });
    }

    try {
      const [callerMembership, targetMembership] = await Promise.all([
        getMembership(event.projectId, event.userId),
        getMembership(event.projectId, targetUserId),
      ]);

      const ownerError = validateIsOwner(callerMembership);
      if (ownerError) {
        return createResponse({
          statusCode: 403,
          message: ownerError,
        });
      }

      const targetExistsError = validateTargetMemberExists(targetMembership);
      if (targetExistsError) {
        return createResponse({
          statusCode: 404,
          message: targetExistsError,
        });
      }

      const targetOwnerError = validateTargetIsNotOwner(targetMembership!);
      if (targetOwnerError) {
        return createResponse({
          statusCode: 400,
          message: targetOwnerError,
        });
      }

      await deleteProjectMembership(event.projectId, targetUserId);

      return createResponse({
        statusCode: 200,
        message: 'Successfully removed member from the project.',
      });
    } catch (error) {
      console.error('Failed to remove project member:', error);
      return createResponse({
        statusCode: 500,
        message: 'Failed to remove project member',
      });
    }
  }
);
