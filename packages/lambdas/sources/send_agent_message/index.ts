import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { userId } = event;

    if (!userId) {
      return createResponse({ statusCode: 401, message: "User not authenticated" });
    }

    const body = event.body ? JSON.parse(event.body) : null;

    if (!body?.message) {
      return createResponse({ statusCode: 400, message: "Missing required field: message" });
    }

    return createResponse({ statusCode: 200, message: { message: body.message } });
  }
);
