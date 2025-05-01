import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTables, scan } from "@kairos-lambdas-libs/dynamodb";
import { logResponse } from "./utils";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async () => {
  const items = await scan({
    tableName: DynamoDBTables.GROCERY_ITEMS_ICONS,
  });

  logResponse(items);

  return createResponse({
    statusCode: 200,
    message: items,
  });
});
