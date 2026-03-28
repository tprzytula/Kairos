import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event;

    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const timestamp = Date.now();

    await putItem({
      tableName: DynamoDBTable.NOISE_TRACKING,
      item: {
        projectId,
        timestamp,
        ...(body.isPrivate && { visibility: "private" as const, ownerId: userId }),
      },
    });

    return createResponse({
      statusCode: 201,
    });
  },
);
