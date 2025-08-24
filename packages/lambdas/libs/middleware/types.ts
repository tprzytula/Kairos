import { APIGatewayProxyEvent } from "aws-lambda";

export interface UserInfo {
  sub: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
}

export interface AuthenticatedEvent extends APIGatewayProxyEvent {
  userId?: string;
  projectId?: string;
  user?: UserInfo;
}
