import { Callback, Context, APIGatewayProxyEvent } from "aws-lambda";
import { middleware, extractUserFromEvent, extractUserObjectFromEvent, extractProjectFromEvent } from ".";

describe("Given the middleware", () => {
  describe("When invoked with a function", () => {
    it("should return a handler for the wrapped function", () => {
      const myFunction = vi.fn();
      const handler = middleware(myFunction);

      expect(typeof handler).toBe("function");
    });

    describe("And the function handler is invoked", () => {
      it("should execute the original function with user and project context", async () => {
        const myFunction = vi.fn();
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
        const myFunction = vi.fn().mockReturnValue(exampleResponse);
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
      const logSpy = vi.spyOn(console, "error");
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
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
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

    it("should return null when JWT payload has no sub field", () => {
      const mockJWT = Buffer.from(JSON.stringify({})).toString('base64') +
                     '.' + Buffer.from(JSON.stringify({ email: "test@example.com" })).toString('base64') +
                     '.' + Buffer.from('signature').toString('base64');

      const event: Partial<APIGatewayProxyEvent> = {
        headers: {
          Authorization: `Bearer ${mockJWT}`
        }
      };

      const userId = extractUserFromEvent(event as APIGatewayProxyEvent);

      expect(userId).toBe(null);
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

  describe("extractUserFromEvent error handling", () => {
    it("should return null and log error when event processing throws", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation();

      const event = {
        get requestContext(): any {
          throw new Error("Unexpected failure");
        },
        headers: {},
      } as unknown as APIGatewayProxyEvent;

      const userId = extractUserFromEvent(event);

      expect(userId).toBe(null);
      expect(errorSpy).toHaveBeenCalledWith(
        "Failed to extract user from event:",
        expect.any(Error),
      );
    });

    it("should return null when JWT payload decoding fails", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation();

      const event: Partial<APIGatewayProxyEvent> = {
        headers: {
          Authorization: "Bearer invalid.notbase64.token",
        },
      };

      const userId = extractUserFromEvent(event as APIGatewayProxyEvent);

      expect(userId).toBe(null);
      expect(warnSpy).toHaveBeenCalledWith(
        "Failed to decode JWT payload:",
        expect.any(Error),
      );
    });
  });

  describe("extractUserObjectFromEvent", () => {
    it("should extract user object from Cognito claims", () => {
      const event: Partial<APIGatewayProxyEvent> = {
        requestContext: {
          authorizer: {
            claims: {
              sub: "user-123",
              email: "test@example.com",
              name: "Test User",
              given_name: "Test",
              family_name: "User",
            },
          },
        } as any,
      };

      const user = extractUserObjectFromEvent(event as APIGatewayProxyEvent);

      expect(user).toEqual({
        sub: "user-123",
        email: "test@example.com",
        name: "Test User",
        given_name: "Test",
        family_name: "User",
      });
    });

    it("should extract user object from JWT Bearer token with sub", () => {
      const payload = {
        sub: "user-789",
        email: "jwt@example.com",
        name: "JWT User",
        given_name: "JWT",
        family_name: "User",
      };
      const mockJWT =
        Buffer.from(JSON.stringify({})).toString("base64") +
        "." +
        Buffer.from(JSON.stringify(payload)).toString("base64") +
        "." +
        Buffer.from("signature").toString("base64");

      const event: Partial<APIGatewayProxyEvent> = {
        headers: {
          Authorization: `Bearer ${mockJWT}`,
        },
      };

      const user = extractUserObjectFromEvent(event as APIGatewayProxyEvent);

      expect(user).toEqual({
        sub: "user-789",
        email: "jwt@example.com",
        name: "JWT User",
        given_name: "JWT",
        family_name: "User",
      });
    });

    it("should return null when JWT payload has no sub field", () => {
      const payload = { email: "no-sub@example.com" };
      const mockJWT =
        Buffer.from(JSON.stringify({})).toString("base64") +
        "." +
        Buffer.from(JSON.stringify(payload)).toString("base64") +
        "." +
        Buffer.from("signature").toString("base64");

      const event: Partial<APIGatewayProxyEvent> = {
        headers: {
          Authorization: `Bearer ${mockJWT}`,
        },
      };

      const user = extractUserObjectFromEvent(event as APIGatewayProxyEvent);

      expect(user).toBe(null);
    });

    it("should return null when no authentication info available", () => {
      const event: Partial<APIGatewayProxyEvent> = {};

      const user = extractUserObjectFromEvent(event as APIGatewayProxyEvent);

      expect(user).toBe(null);
    });

    it("should return null and log error when event processing throws", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation();

      const event = {
        get requestContext(): any {
          throw new Error("Unexpected failure");
        },
        headers: {},
      } as unknown as APIGatewayProxyEvent;

      const user = extractUserObjectFromEvent(event);

      expect(user).toBe(null);
      expect(errorSpy).toHaveBeenCalledWith(
        "Failed to extract user object from event:",
        expect.any(Error),
      );
    });

    it("should return null when JWT payload decoding fails", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation();

      const event: Partial<APIGatewayProxyEvent> = {
        headers: {
          Authorization: "Bearer invalid.notbase64.token",
        },
      };

      const user = extractUserObjectFromEvent(event as APIGatewayProxyEvent);

      expect(user).toBe(null);
      expect(warnSpy).toHaveBeenCalledWith(
        "Failed to decode JWT payload:",
        expect.any(Error),
      );
    });
  });
});
