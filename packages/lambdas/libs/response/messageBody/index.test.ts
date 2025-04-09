import { createBody } from ".";

describe("Given the createBody function", () => {
  it("should return generic 200 response by default", () => {
    const response = createBody({ statusCode: 200 });

    expect(response).toBe("OK");
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
      const response = createBody({ statusCode });

      expect(response).toBe(expectedBody);
    },
  );

  it("should allow to override the body with a custom message", () => {
    const response = createBody({
      statusCode: 200,
      message: "Everything went well",
    });

    expect(response).toBe("Everything went well");
  });

  it("should allow to override the body with a custom object message", () => {
    const response = createBody({
      statusCode: 200,
      message: { something: "Hello", somethingElse: "There" },
    });

    expect(response).toBe(
      JSON.stringify({
        something: "Hello",
        somethingElse: "There",
      }),
    );
  });
});
