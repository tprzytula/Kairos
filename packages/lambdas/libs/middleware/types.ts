import { APIGatewayProxyEvent } from "aws-lambda";

export interface AuthenticatedEvent extends APIGatewayProxyEvent {
  userId?: string;
  projectId?: string;
}
