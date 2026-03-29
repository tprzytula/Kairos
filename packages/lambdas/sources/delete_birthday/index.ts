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

    if (!id) {
      return createResponse({ statusCode: 400 });
    }

    const existingItem = await getItem({
      tableName: DynamoDBTable.BIRTHDAYS,
      item: { id },
    });

    if (existingItem && !verifyPrivateItemOwnership(existingItem, userId ?? '')) {
      return createResponse({
        statusCode: 403,
        message: "You do not have permission to modify this item",
      });
    }

    await deleteItem({
      key: { id },
      tableName: DynamoDBTable.BIRTHDAYS,
    });

    return createResponse({ statusCode: 200 });
  },
);
