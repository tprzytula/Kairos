import { getBody } from ".";

describe("Given the getBody function", () => {
  it("should return the parsed body when valid name is provided", () => {
    const validBody = JSON.stringify({
      id: "test-id",
      name: "Updated Todo",
    });

    const result = getBody(validBody);

    expect(result).toEqual({
      id: "test-id",
      name: "Updated Todo",
    });
  });

  it("should return the parsed body when multiple fields are provided", () => {
    const validBody = JSON.stringify({
      id: "test-id",
      name: "Test Todo",
      description: "Test description",
      dueDate: 1234567890,
      isDone: true,
    });

    const result = getBody(validBody);

    expect(result).toEqual({
      id: "test-id",
      name: "Test Todo",
      description: "Test description",
      dueDate: 1234567890,
      isDone: true,
    });
  });

  it("should return the parsed body when only isDone is provided", () => {
    const validBody = JSON.stringify({
      id: "test-id",
      isDone: false,
    });

    const result = getBody(validBody);

    expect(result).toEqual({
      id: "test-id",
      isDone: false,
    });
  });

  it("should return the parsed body when only description is provided", () => {
    const validBody = JSON.stringify({
      id: "test-id",
      description: "New description",
    });

    const result = getBody(validBody);

    expect(result).toEqual({
      id: "test-id",
      description: "New description",
    });
  });

  it("should return the parsed body when only dueDate is provided", () => {
    const validBody = JSON.stringify({
      id: "test-id",
      dueDate: 1234567890,
    });

    const result = getBody(validBody);

    expect(result).toEqual({
      id: "test-id",
      dueDate: 1234567890,
    });
  });

  it("should return null when body is null", () => {
    const result = getBody(null);

    expect(result).toBeNull();
  });

  it("should return null when body is invalid JSON", () => {
    const result = getBody("invalid json");

    expect(result).toBeNull();
  });

  it("should return null when id is missing", () => {
    const invalidBody = JSON.stringify({
      name: "Todo without ID",
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });

  it("should return null when no updateable fields are provided", () => {
    const invalidBody = JSON.stringify({
      id: "test-id",
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });

  it("should return null when name is empty string", () => {
    const invalidBody = JSON.stringify({
      id: "test-id",
      name: "",
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });

  it("should return null when name is only whitespace", () => {
    const invalidBody = JSON.stringify({
      id: "test-id",
      name: "   ",
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });

  it("should return null when dueDate is negative", () => {
    const invalidBody = JSON.stringify({
      id: "test-id",
      dueDate: -1,
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });

  it("should return null when dueDate is not a number", () => {
    const invalidBody = JSON.stringify({
      id: "test-id",
      dueDate: "invalid",
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });

  it("should return null when isDone is not a boolean", () => {
    const invalidBody = JSON.stringify({
      id: "test-id",
      isDone: "true",
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });

  it("should return null when description is not a string", () => {
    const invalidBody = JSON.stringify({
      id: "test-id",
      description: 123,
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });

  it("should allow null values for optional fields", () => {
    const validBody = JSON.stringify({
      id: "test-id",
      description: null,
      dueDate: null,
    });

    const result = getBody(validBody);

    expect(result).toEqual({
      id: "test-id",
      description: null,
      dueDate: null,
    });
  });
});