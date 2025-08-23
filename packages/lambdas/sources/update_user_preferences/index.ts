import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { updateUserPreferences } from "./utils";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async (event: AuthenticatedEvent) => {
  const { userId } = event;
  
  if (!userId) {
    return createResponse({
      statusCode: 401,
      message: "User not authenticated",
    });
  }

  const body = getBody(event.body);

  if (!body) {
    return createResponse({
      statusCode: 400,
      message: "Invalid request body",
    });
  }

  try {
    const updatedPreferences = await updateUserPreferences(userId, body);

    return createResponse({
      statusCode: 200,
      message: updatedPreferences,
    });
  } catch (error) {
    console.error("Failed to update user preferences:", error);
    return createResponse({
      statusCode: 500,
      message: "Failed to update user preferences",
    });
  }
});
