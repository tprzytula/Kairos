import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { createAdventure } from "./database";

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId, userId } = event;

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

    const { name, date, endDate, time, location, notes, imagePath, isPrivate } = body;

    const id = await createAdventure({ projectId, name, date, endDate, time, location, notes, imagePath, isPrivate, userId });

    return createResponse({
      statusCode: 201,
      message: { id },
    });
  },
);
