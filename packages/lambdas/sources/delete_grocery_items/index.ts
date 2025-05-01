import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTables, deleteItems } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event) => {
    if (!event.body) {
      return createResponse({
        statusCode: 400,
      });
    }

    const { ids } = JSON.parse(event.body);

    if (!ids || !Array.isArray(ids)) {
      return createResponse({
        statusCode: 400,
      });
    }

    await deleteItems({
      ids,
      tableName: DynamoDBTables.GROCERY_LIST,
    });

    return createResponse({
      statusCode: 200,
    });
  },
);
