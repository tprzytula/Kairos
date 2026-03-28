import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { DynamoDBTable, updateItem, getItem, verifyPrivateItemOwnership } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event;
    
    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const body = getBody(event.body);

    if (!body) {
      return createResponse({
        statusCode: 400,
      });
    }

    const { id, ...updatedFields } = body;

    const existingItem = await getItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      key: { id },
    });

    if (existingItem && !verifyPrivateItemOwnership(existingItem, userId ?? '')) {
      return createResponse({
        statusCode: 403,
        message: "You do not have permission to modify this item",
      });
    }

    await updateItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      key: { id },
      updatedFields,
    });
  
    return createResponse({
      statusCode: 200,
      message: {
        id,
        ...updatedFields,
      },
    });
  },
); 