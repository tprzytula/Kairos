import { getExpressionAttributeValues, getKeyConditionExpression } from "./utils";

describe("Given the getKeyConditionExpression function", () => {
  it("should return the correct key condition expression", () => {
    const result = getKeyConditionExpression({ name: "test" });
    expect(result).toBe("name = :name");
  });
});

describe("Given the getExpressionAttributeValues function", () => {
  it("should return the correct expression attribute values", () => {
    const result = getExpressionAttributeValues({ name: "test" });
    expect(result).toEqual({ ":name": "test" });
  });
});
