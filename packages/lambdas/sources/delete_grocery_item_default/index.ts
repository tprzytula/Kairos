import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, deleteItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { name } = event.pathParameters ?? {};

    if (!name || typeof name !== "string") {
      return createResponse({
        statusCode: 400,
      });
    }

    await deleteItem({
      key: {
        name,
      },
      tableName: DynamoDBTable.GROCERY_ITEMS_DEFAULTS,
    });

    return createResponse({
      statusCode: 200,
    });
  },
);
