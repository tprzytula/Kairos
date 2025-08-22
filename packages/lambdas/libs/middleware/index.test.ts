import { Callback, Context, APIGatewayProxyEvent } from "aws-lambda";
import { middleware, extractUserFromEvent, extractProjectFromEvent } from ".";

describe("Given the middleware", () => {
  describe("When invoked with a function", () => {
    it("should return a handler for the wrapped function", () => {
      const myFunction = jest.fn();
      const handler = middleware(myFunction);

      expect(typeof handler).toBe("function");
    });

    describe("And the function handler is invoked", () => {
      it("should execute the original function with user and project context", async () => {
        const myFunction = jest.fn();
        const handler = middleware(myFunction);

        const event: Partial<APIGatewayProxyEvent> = {
          requestContext: {
            authorizer: {
              claims: {
                sub: "user-123"
              }
            }
          } as any,
          headers: {
            "X-Project-ID": "project-456"
          }
        };
        const context = {} as unknown as Context;
        const callback = {} as unknown as Callback;

        await handler(event as APIGatewayProxyEvent, context, callback);

        expect(myFunction).toHaveBeenCalledWith(
          expect.objectContaining({
            ...event,
            userId: "user-123",
            projectId: "project-456",
          }),
          context,
          callback
        );
      });

      it("should return the function response", async () => {
        const exampleResponse = {
          statusCode: 200,
          body: "Well Done",
        };
        const myFunction = jest.fn().mockReturnValue(exampleResponse);
        const handler = middleware(myFunction);

        const event = {} as APIGatewayProxyEvent;
        const context = {} as unknown as Context;
        const callback = {} as unknown as Callback;

        const response = await handler(event, context, callback);

        expect(response).toBe(exampleResponse);
      });
    });
  });

  describe("When invoked with a lambda handler that throws an exception", () => {
    it("should log the error", async () => {
      const logSpy = jest.spyOn(console, "error");
      const myExceptionFunction = () => {
        throw Error("EXCEPTION");
      };

      const handler = await middleware(myExceptionFunction);
      const event = {} as APIGatewayProxyEvent;
      const context = {} as unknown as Context;
      const callback = {} as unknown as Callback;

      await handler(event, context, callback);

      expect(logSpy).toHaveBeenCalledWith(
        "Handler Threw Exception:",
        new Error("EXCEPTION"),
      );
    });

    it("should return a 500 response", async () => {
      const myExceptionFunction = () => {
        throw Error("EXCEPTION");
      };

      const handler = await middleware(myExceptionFunction);
      const event = {} as APIGatewayProxyEvent  ;
      const context = {} as unknown as Context;
      const callback = {} as unknown as Callback;

      const response = await handler(event, context, callback);

      expect(response).toStrictEqual({
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: "Internal Server Error",
      });
    });
  });

  describe("extractUserFromEvent", () => {
    it("should extract user ID from Cognito claims", () => {
      const event: Partial<APIGatewayProxyEvent> = {
        requestContext: {
          authorizer: {
            claims: {
              sub: "user-123"
            }
          }
        } as any
      };

      const userId = extractUserFromEvent(event as APIGatewayProxyEvent);

      expect(userId).toBe("user-123");
    });

    it("should extract user ID from JWT Bearer token", () => {
      const mockJWT = Buffer.from(JSON.stringify({})).toString('base64') + 
                     '.' + Buffer.from(JSON.stringify({ sub: "user-456" })).toString('base64') + 
                     '.' + Buffer.from('signature').toString('base64');
      
      const event: Partial<APIGatewayProxyEvent> = {
        headers: {
          Authorization: `Bearer ${mockJWT}`
        }
      };

      const userId = extractUserFromEvent(event as APIGatewayProxyEvent);

      expect(userId).toBe("user-456");
    });

    it("should return null when no authentication info available", () => {
      const event: Partial<APIGatewayProxyEvent> = {};

      const userId = extractUserFromEvent(event as APIGatewayProxyEvent);

      expect(userId).toBe(null);
    });
  });

  describe("extractProjectFromEvent", () => {
    it("should extract project ID from X-Project-ID header", () => {
      const event: Partial<APIGatewayProxyEvent> = {
        headers: {
          "X-Project-ID": "project-123"
        }
      };

      const projectId = extractProjectFromEvent(event as APIGatewayProxyEvent);

      expect(projectId).toBe("project-123");
    });

    it("should extract project ID from lowercase x-project-id header", () => {
      const event: Partial<APIGatewayProxyEvent> = {
        headers: {
          "x-project-id": "project-456"
        }
      };

      const projectId = extractProjectFromEvent(event as APIGatewayProxyEvent);

      expect(projectId).toBe("project-456");
    });

    it("should return null when no project ID header available", () => {
      const event: Partial<APIGatewayProxyEvent> = {};

      const projectId = extractProjectFromEvent(event as APIGatewayProxyEvent);

      expect(projectId).toBe(null);
    });
  });
});
