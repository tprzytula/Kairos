import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getUserPreferences } from "./utils";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async (event: AuthenticatedEvent) => {
  const { userId } = event;
  
  if (!userId) {
    return createResponse({
      statusCode: 401,
      message: "User not authenticated",
    });
  }

  try {
    const preferences = await getUserPreferences(userId);

    return createResponse({
      statusCode: 200,
      message: preferences,
    });
  } catch (error) {
    console.error("Failed to get user preferences:", error);
    return createResponse({
      statusCode: 500,
      message: "Failed to retrieve user preferences",
    });
  }
});
