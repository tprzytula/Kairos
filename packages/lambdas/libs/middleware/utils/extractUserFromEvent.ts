import { APIGatewayProxyEvent } from "aws-lambda";
import { UserInfo } from "../types";

export const extractUserFromEvent = (event: APIGatewayProxyEvent): string | null => {
  try {
    const claims = event.requestContext?.authorizer?.claims;

    if (claims && claims.sub) {
      return claims.sub;
    }
    
    const authHeader = event.headers?.Authorization || event.headers?.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return payload.sub || null;
      } catch (e) {
        console.warn("Failed to decode JWT payload:", e);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Failed to extract user from event:", error);
    return null;
  }
};

export const extractUserObjectFromEvent = (event: APIGatewayProxyEvent): UserInfo | null => {
  try {
    const claims = event.requestContext?.authorizer?.claims;

    if (claims && claims.sub) {
      return {
        sub: claims.sub,
        email: claims.email,
        name: claims.name,
        given_name: claims.given_name,
        family_name: claims.family_name,
      };
    }
    
    const authHeader = event.headers?.Authorization || event.headers?.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        if (payload.sub) {
          return {
            sub: payload.sub,
            email: payload.email,
            name: payload.name,
            given_name: payload.given_name,
            family_name: payload.family_name,
          };
        }
        return null;
      } catch (e) {
        console.warn("Failed to decode JWT payload:", e);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Failed to extract user object from event:", error);
    return null;
  }
};
