import { createResponse } from ".";

const expectedHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
};

describe("Given the creteResponse function", () => {
  it("should return generic 200 response by default", () => {
    const response = createResponse({});

    expect(response).toStrictEqual({
      body: "OK",
      headers: expectedHeaders,
      statusCode: 200,
    });
  });

  test.each([
    {
      statusCode: 200,
      expectedBody: "OK",
    },
    {
      statusCode: 201,
      expectedBody: "Created",
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
        body: expectedBody,
        headers: expectedHeaders,
        statusCode,
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
      headers: expectedHeaders,
      statusCode: 200,
    });
  });

  it("should allow to override the body with a custom object message", () => {
    const response = createResponse({
      statusCode: 200,
      message: { something: "Hello", somethingElse: "There" },
    });

    expect(response).toStrictEqual({
      body: '{"something":"Hello","somethingElse":"There"}',
      headers: expectedHeaders,
      statusCode: 200,
    });
  });
});