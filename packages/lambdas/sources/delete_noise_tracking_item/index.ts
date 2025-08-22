import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, deleteItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId } = event;
    
    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const { timestamp } = event.pathParameters ?? {};

    if (!timestamp) {
      return createResponse({
        statusCode: 400,
      });
    }

    await deleteItem({
      key: {
        projectId,
        timestamp: parseInt(timestamp, 10),
      },
      tableName: DynamoDBTable.NOISE_TRACKING,
    });

    return createResponse({
      statusCode: 200,
    });
  },
);
