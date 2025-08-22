import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { retrieveUserProjects } from "./utils/retrieveUserProjects";
import { sortProjects } from "./utils/sortProjects";

export const handler: Handler<APIGatewayProxyEvent> = middleware(async (event: AuthenticatedEvent) => {
  const { userId } = event;
  
  if (!userId) {
    return createResponse({
      statusCode: 401,
      message: "User not authenticated",
    });
  }

  try {
    const projects = await retrieveUserProjects(userId);
    const sortedProjects = sortProjects(projects);

    return createResponse({
      statusCode: 200,
      message: sortedProjects,
    });
  } catch (error) {
    console.error("Failed to get user projects:", error);
    return createResponse({
      statusCode: 500,
      message: "Failed to retrieve projects",
    });
  }
});
