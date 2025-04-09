import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTables, scan } from "@kairos-lambdas-libs/dynamodb";
import { parseItems } from "./parser";
import { logResponse } from "./utils";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async () => {
    const items = await scan({
      tableName: DynamoDBTables.GROCERY_LIST,
    });

    const parsedItems = parseItems(items);

    logResponse(parsedItems);

    return createResponse({
      statusCode: 200,
      message: parsedItems,
    });
  },
);
