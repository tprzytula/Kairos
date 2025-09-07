import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { upsertItem } from "./database";
import { getBody } from "./body";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId } = event;
    
    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const body = getBody(event.body);

    if (!body) {
      return createResponse({
        statusCode: 400,
      });
    }

    const { name, icon } = body; 
    
    const { id, statusCode } = await upsertItem({
      projectId,
      name,
      icon,
    });

    return createResponse({
      statusCode,
      message: {
        id,
      },
    });
  },
);
