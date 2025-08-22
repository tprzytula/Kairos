import { Handler, Context, Callback, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda";
import { createResponse } from "@kairos-lambdas-libs/response";
import { AuthenticatedEvent } from "./types";
import { extractUserFromEvent, extractProjectFromEvent } from "./utils";

export type { AuthenticatedEvent } from "./types";
export { extractUserFromEvent, extractProjectFromEvent } from "./utils";

export const middleware =
  <T extends APIGatewayProxyEvent>(handler: Handler<AuthenticatedEvent, APIGatewayProxyResult>) =>
  async (
    event: T,
    context: Context,
    callback: Callback<APIGatewayProxyResult>,
  ): Promise<APIGatewayProxyResult> => {
    console.log("Event:", JSON.stringify(event));

    try {
      const userId = extractUserFromEvent(event);
      const projectId = extractProjectFromEvent(event);
      
      const authenticatedEvent: AuthenticatedEvent = {
        ...event,
        userId: userId || undefined,
        projectId: projectId || undefined,
      };

      console.log("Authenticated User ID:", userId);
      console.log("Project ID:", projectId);

      const response = await handler(authenticatedEvent, context, callback);
      console.log("Handler Response:", response);
      return response || createResponse({ statusCode: 500 });
    } catch (error) {
      console.error("Handler Threw Exception:", error);
      return createResponse({ statusCode: 500 });
    }
  };
