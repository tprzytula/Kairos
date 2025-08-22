import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, deleteItems } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId } = event;
    
    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

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
      tableName: DynamoDBTable.GROCERY_LIST,
    });

    return createResponse({
      statusCode: 200,
    });
  },
);
