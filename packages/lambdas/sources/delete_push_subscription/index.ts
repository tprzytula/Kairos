import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, deleteItem } from "@kairos-lambdas-libs/dynamodb";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { userId } = event;
    
    if (!userId) {
      return createResponse({
        statusCode: 401,
        message: "User authentication required",
      });
    }

    const endpoint = event.queryStringParameters?.endpoint;
    
    if (!endpoint) {
      return createResponse({
        statusCode: 400,
        message: "Missing endpoint parameter",
      });
    }

    try {
      await deleteItem({
        tableName: DynamoDBTable.PUSH_SUBSCRIPTIONS,
        key: {
          userId,
          endpoint: decodeURIComponent(endpoint),
        },
      });

      return createResponse({
        statusCode: 200,
        message: {
          success: true,
        },
      });
    } catch (error) {
      console.error("Failed to delete push subscription:", error);
      return createResponse({
        statusCode: 500,
        message: "Failed to delete push subscription",
      });
    }
  },
);
