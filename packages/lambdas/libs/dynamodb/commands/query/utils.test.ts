import { getExpressionAttributeNames, getExpressionAttributeValues, getKeyConditionExpression } from "./utils";

describe("Given the getKeyConditionExpression function", () => {
  it("should return the correct key condition expression", () => {
    const result = getKeyConditionExpression({ name: "test" });
    expect(result).toBe("#name = :name");
  });
});

describe("Given the getExpressionAttributeValues function", () => {
  it("should return the correct expression attribute values", () => {
    const result = getExpressionAttributeValues({ name: "test" });
    expect(result).toEqual({ ":name": "test" });
  });
});

describe("Given the getExpressionAttributeNames function", () => {
  it("should return the correct expression attribute names", () => {
    const result = getExpressionAttributeNames({ name: "test" });
    expect(result).toEqual({ "#name": "name" });
  });
});
