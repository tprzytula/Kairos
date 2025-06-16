import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, scan } from "@kairos-lambdas-libs/dynamodb";
import { logResponse, sortItems } from "./utils";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async () => {
  const items = await scan({
    tableName: DynamoDBTable.GROCERY_LIST,
  });

  console.error(items);

  const sortedItems = sortItems(items);

  console.error(sortedItems);

  logResponse(sortedItems);

  return createResponse({
    statusCode: 200,
    message: sortedItems,
  });
});
