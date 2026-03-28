import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, deleteItem, getItem, verifyPrivateItemOwnership } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event;

    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const { id } = event.pathParameters ?? {};

    if (!id || typeof id !== "string") {
      return createResponse({
        statusCode: 400,
      });
    }

    const existingItem = await getItem({
      tableName: DynamoDBTable.ADVENTURES,
      key: { id },
    });

    if (existingItem && !verifyPrivateItemOwnership(existingItem, userId ?? '')) {
      return createResponse({
        statusCode: 403,
        message: "You do not have permission to modify this item",
      });
    }

    await deleteItem({
      key: { id },
      tableName: DynamoDBTable.ADVENTURES,
    });

    return createResponse({
      statusCode: 200,
    });
  },
);
