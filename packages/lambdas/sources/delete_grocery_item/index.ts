import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTables, deleteItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    const { id } = event.pathParameters ?? {};

    if (!id || typeof id !== "string") {
      return createResponse({
        statusCode: 400,
      });
    }

    await deleteItem({
      id,
      tableName: DynamoDBTables.GROCERY_LIST,
    });

    return createResponse({
      statusCode: 200,
    });
  },
);
