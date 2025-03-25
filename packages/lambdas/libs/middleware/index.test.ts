import { Callback, Context } from "aws-lambda";
import { middleware } from ".";

describe("Given the middleware", () => {
  describe("When invoked with a function", () => {
    it("should return a handler for the wrapped function", () => {
      const myFunction = jest.fn();
      const handler = middleware(myFunction);

      expect(typeof handler).toBe("function");
    });

    describe("And the function handler is invoked", () => {
      it("should execute the original function", async () => {
        const myFunction = jest.fn();
        const handler = middleware(myFunction);

        const event = {};
        const context = {} as unknown as Context;
        const callback = {} as unknown as Callback;

        await handler(event, context, callback);

        expect(myFunction).toHaveBeenCalledWith(event, context, callback);
      });

      it("should return the function response", async () => {
        const exampleResponse = {
          statusCode: 200,
          body: "Well Done",
        };
        const myFunction = jest.fn().mockReturnValue(exampleResponse);
        const handler = middleware(myFunction);

        const event = {};
        const context = {} as unknown as Context;
        const callback = {} as unknown as Callback;

        const response = await handler(event, context, callback);

        expect(response).toBe(exampleResponse);
      });
    });
  });

  describe("When invoked with a lambda handler that throws an exception", () => {
    it("should log the error", async () => {
      const logSpy = jest.spyOn(console, "log");
      const myExceptionFunction = () => {
        throw Error("EXCEPTION");
      };

      const handler = await middleware(myExceptionFunction);
      const event = {};
      const context = {} as unknown as Context;
      const callback = {} as unknown as Callback;

      await handler(event, context, callback);

      expect(logSpy).toHaveBeenCalledWith(
        "Handler Threw Exception:",
        expect.any(Object), // TODO: Turn into something more specific
      );
    });

    it("should return a 500 response", async () => {
      const myExceptionFunction = () => {
        throw Error("EXCEPTION");
      };

      const handler = await middleware(myExceptionFunction);
      const event = {};
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
});
