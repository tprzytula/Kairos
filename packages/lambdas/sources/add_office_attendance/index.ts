import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { createOfficeAttendance } from "./database";

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

    const { date, userId: attendeeUserId, userName, userAvatar } = body;

    const id = await createOfficeAttendance({
      projectId,
      date,
      userId: attendeeUserId,
      userName,
      userAvatar,
      createdBy: userId ?? "",
    });

    return createResponse({
      statusCode: 201,
      message: { id },
    });
  },
);
