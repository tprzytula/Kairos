import { APIGatewayProxyEvent } from "aws-lambda";

export const extractProjectFromEvent = (event: APIGatewayProxyEvent): string | null => {
  const projectId = event.headers?.["X-Project-ID"] || event.headers?.["x-project-id"];
  
  return projectId || null;
};
