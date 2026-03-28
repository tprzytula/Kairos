import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { DynamoDBTable, updateItems, getItem, verifyPrivateItemOwnership } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event;
    
    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const { items } = getBody(event.body) ?? {};

    if (!items) {
      return createResponse({
        statusCode: 400,
      });
    }

    for (const item of items) {
      const existingItem = await getItem({
        tableName: DynamoDBTable.TODO_LIST,
        key: { id: item.id },
      });

      if (existingItem && !verifyPrivateItemOwnership(existingItem, userId ?? '')) {
        return createResponse({
          statusCode: 403,
          message: "You do not have permission to modify this item",
        });
      }
    }

    await updateItems({
      tableName: DynamoDBTable.TODO_LIST,
      items: items.map(({ id, isDone }) => ({
        id,
        fieldsToUpdate: {
          isDone,
        },
      })),
    });
  
    return createResponse({
      statusCode: 200,
      message: {
        items,
      },
    });
  },
);
