import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, scan } from "@kairos-lambdas-libs/dynamodb";
import { logResponse } from "./utils";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async () => {
  const items = await scan({
    tableName: DynamoDBTable.TODO_LIST,
  });

  logResponse(items);

  return createResponse({
    statusCode: 200,
    message: items,
  });
});
