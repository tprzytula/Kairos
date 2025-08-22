import { APIGatewayProxyEvent } from "aws-lambda";

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
