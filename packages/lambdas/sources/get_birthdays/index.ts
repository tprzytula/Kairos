import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, DynamoDBIndex, query } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async (event: AuthenticatedEvent) => {
  const { projectId } = event;

  if (!projectId) {
    return createResponse({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  const items = await query({
    tableName: DynamoDBTable.BIRTHDAYS,
    indexName: DynamoDBIndex.BIRTHDAYS_PROJECT,
    attributes: {
      projectId,
    },
  });

  return createResponse({
    statusCode: 200,
    message: items,
  });
});
