import { getBody } from ".";
import { GroceryItemUnit } from '@kairos-lambdas-libs/dynamodb';

describe("Given the getBody function", () => {
  it("should return the parsed body when valid quantity is provided", () => {
    const validBody = JSON.stringify({
      id: "test-id",
      quantity: "5",
    });

    const result = getBody(validBody);

    expect(result).toEqual({
      id: "test-id",
      quantity: "5",
    });
  });

  it("should return the parsed body when multiple fields are provided", () => {
    const validBody = JSON.stringify({
      id: "test-id",
      quantity: "3",
      name: "Test Item",
      unit: GroceryItemUnit.KILOGRAM,
      imagePath: "/test.png",
    });

    const result = getBody(validBody);

    expect(result).toEqual({
      id: "test-id",
      quantity: "3",
      name: "Test Item",
      unit: GroceryItemUnit.KILOGRAM,
      imagePath: "/test.png",
    });
  });

  it("should return the parsed body when only name is provided", () => {
    const validBody = JSON.stringify({
      id: "test-id",
      name: "Updated Item",
    });

    const result = getBody(validBody);

    expect(result).toEqual({
      id: "test-id",
      name: "Updated Item",
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
      quantity: "5",
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

  it("should return null when quantity is not a valid number", () => {
    const invalidBody = JSON.stringify({
      id: "test-id",
      quantity: "invalid",
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });

  it("should return null when quantity is less than 1", () => {
    const invalidBody = JSON.stringify({
      id: "test-id",
      quantity: "0",
    });

    const result = getBody(invalidBody);

    expect(result).toBeNull();
  });
}); 