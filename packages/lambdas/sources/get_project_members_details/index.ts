import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getProjectMembers } from "./database";

const cognitoClient = new CognitoIdentityProviderClient({});
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID ?? "";

interface MemberDetails {
  userId: string;
  name: string;
  givenName?: string;
  avatar?: string;
  role: string;
}

const getUserDetails = async (
  userId: string,
): Promise<{ name: string; givenName?: string; avatar?: string }> => {
  try {
    const command = new ListUsersCommand({
      UserPoolId: USER_POOL_ID,
      Filter: `sub = "${userId}"`,
      Limit: 1,
    });
    const response = await cognitoClient.send(command);
    const attrs = response.Users?.[0]?.Attributes ?? [];

    const getAttribute = (name: string): string | undefined =>
      attrs.find((a) => a.Name === name)?.Value;

    return {
      name: getAttribute("name") ?? getAttribute("given_name") ?? "Unknown",
      givenName: getAttribute("given_name"),
      avatar: getAttribute("picture"),
    };
  } catch (error) {
    console.error(`Failed to get Cognito details for user ${userId}:`, error);
    return { name: "Unknown" };
  }
};

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId } = event;

    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const members = await getProjectMembers(projectId);

    const memberDetails: MemberDetails[] = await Promise.all(
      members.map(async (member) => {
        const details = await getUserDetails(member.userId);
        return {
          userId: member.userId,
          name: details.name,
          givenName: details.givenName,
          avatar: details.avatar,
          role: member.role,
        };
      }),
    );

    return createResponse({
      statusCode: 200,
      message: memberDetails,
    });
  },
);
