import { createResponse } from ".";

describe("Given the creteResponse function", () => {
  it("should return generic 200 response by default", () => {
    const response = createResponse({});

    expect(response).toStrictEqual({
      body: "OK",
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 200,
    });
  });

  test.each([
    {
      statusCode: 200,
      expectedBody: "OK",
    },
    {
      statusCode: 400,
      expectedBody: "Bad Request",
    },
    {
      statusCode: 500,
      expectedBody: "Internal Server Error",
    },
  ])(
    "should return the correct default body for statusCode $code",
    ({ statusCode, expectedBody }) => {
      const response = createResponse({ statusCode });

      expect(response).toStrictEqual({
        statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: expectedBody,
      });
    },
  );

  it("should allow to override the body with a custom message", () => {
    const response = createResponse({
      statusCode: 200,
      message: "Everything went well",
    });

    expect(response).toStrictEqual({
      body: "Everything went well",
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 200,
    });
  });

  it("should allow to override the body with a custom object message", () => {
    const response = createResponse({
      statusCode: 200,
      message: { something: "Hello", somethingElse: "There" },
    });

    expect(response).toStrictEqual({
      body: JSON.stringify({
        something: "Hello",
        somethingElse: "There",
      }),
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 200,
    });
  });
});
