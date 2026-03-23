import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { generateUploadUrl } from "./s3";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const extension = event.queryStringParameters?.extension;

    if (!extension) {
      return createResponse({
        statusCode: 400,
        message: "extension query parameter is required",
      });
    }

    const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!safeExtension) {
      return createResponse({
        statusCode: 400,
        message: "Invalid extension",
      });
    }

    const result = await generateUploadUrl(safeExtension);

    return createResponse({
      statusCode: 200,
      message: result,
    });
  },
);
