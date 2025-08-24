import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { getBody } from "./body";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { userId } = event;
    
    if (!userId) {
      return createResponse({
        statusCode: 401,
        message: "User authentication required",
      });
    }

    const body = getBody(event.body);
    
    if (!body) {
      return createResponse({
        statusCode: 400,
        message: "Invalid request body",
      });
    }

    const { endpoint, keys } = body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return createResponse({
        statusCode: 400,
        message: "Missing required subscription fields",
      });
    }

    try {
      await putItem({
        tableName: DynamoDBTable.PUSH_SUBSCRIPTIONS,
        item: {
          userId,
          endpoint,
          keys,
          createdAt: Date.now(),
        },
      });

      return createResponse({
        statusCode: 201,
        message: {
          success: true,
        },
      });
    } catch (error) {
      console.error("Failed to save push subscription:", error);
      return createResponse({
        statusCode: 500,
        message: "Failed to save push subscription",
      });
    }
  },
);
