import { Handler, Context, Callback, APIGatewayProxyResult } from "aws-lambda";
import { createResponse } from "@kairos-lambdas-libs/response";

export const middleware =
  <T>(handler: Handler<T, APIGatewayProxyResult>) =>
  async (
    event: T,
    context: Context,
    callback: Callback<APIGatewayProxyResult>,
  ) => {
    console.log("Event:", JSON.stringify(event));

    try {
      const response = await handler(event, context, callback);
      console.log("Handler Response:", response);
      return response;
    } catch (error) {
      console.log("Handler Threw Exception:", error);
      return createResponse({ statusCode: 500 });
    }
  };
