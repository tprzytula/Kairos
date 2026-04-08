import { getExpressionAttributeNames, getExpressionAttributeValues, getKeyConditionExpression } from "./utils";

describe("Given the getKeyConditionExpression function", () => {
  it("should return an equality expression for a plain string attribute", () => {
    const result = getKeyConditionExpression({ name: "test" });
    expect(result).toBe("#name = :name");
  });

  it("should return an equality expression for an explicit equals operator", () => {
    const result = getKeyConditionExpression({ name: { value: "test", operator: "=" } });
    expect(result).toBe("#name = :name");
  });

  it("should return a begins_with expression", () => {
    const result = getKeyConditionExpression({ sk: { value: "PREFIX#", operator: "begins_with" } });
    expect(result).toBe("begins_with(#sk, :sk)");
  });

  it("should return a less-than expression", () => {
    const result = getKeyConditionExpression({ age: { value: "30", operator: "<" } });
    expect(result).toBe("#age < :age");
  });

  it("should return a greater-than expression", () => {
    const result = getKeyConditionExpression({ age: { value: "18", operator: ">" } });
    expect(result).toBe("#age > :age");
  });

  it("should return a less-than-or-equal expression", () => {
    const result = getKeyConditionExpression({ score: { value: "100", operator: "<=" } });
    expect(result).toBe("#score <= :score");
  });

  it("should return a greater-than-or-equal expression", () => {
    const result = getKeyConditionExpression({ score: { value: "50", operator: ">=" } });
    expect(result).toBe("#score >= :score");
  });

  it("should return a BETWEEN expression", () => {
    const result = getKeyConditionExpression({
      date: { value: "2026-01-01", operator: "BETWEEN", valueBetweenEnd: "2026-12-31" },
    });
    expect(result).toBe("#date BETWEEN :date_start AND :date_end");
  });

  it("should combine multiple attributes with AND", () => {
    const result = getKeyConditionExpression({
      pk: "project-1",
      sk: { value: "ITEM#", operator: "begins_with" },
    });
    expect(result).toBe("#pk = :pk AND begins_with(#sk, :sk)");
  });

  it("should default to equality when operator is not specified in an object", () => {
    const result = getKeyConditionExpression({ name: { value: "test" } });
    expect(result).toBe("#name = :name");
  });
});

describe("Given the getExpressionAttributeValues function", () => {
  it("should return the correct values for a plain string attribute", () => {
    const result = getExpressionAttributeValues({ name: "test" });
    expect(result).toEqual({ ":name": "test" });
  });

  it("should return the correct values for an object attribute", () => {
    const result = getExpressionAttributeValues({ name: { value: "test", operator: "=" } });
    expect(result).toEqual({ ":name": "test" });
  });

  it("should return start and end values for a BETWEEN operator", () => {
    const result = getExpressionAttributeValues({
      date: { value: "2026-01-01", operator: "BETWEEN", valueBetweenEnd: "2026-12-31" },
    });
    expect(result).toEqual({ ":date_start": "2026-01-01", ":date_end": "2026-12-31" });
  });

  it("should handle mixed string and object attributes", () => {
    const result = getExpressionAttributeValues({
      pk: "project-1",
      sk: { value: "PREFIX#", operator: "begins_with" },
    });
    expect(result).toEqual({ ":pk": "project-1", ":sk": "PREFIX#" });
  });
});

describe("Given the getExpressionAttributeNames function", () => {
  it("should return the correct expression attribute names for string attributes", () => {
    const result = getExpressionAttributeNames({ name: "test" });
    expect(result).toEqual({ "#name": "name" });
  });

  it("should return the correct expression attribute names for object attributes", () => {
    const result = getExpressionAttributeNames({
      pk: "val",
      sk: { value: "PREFIX#", operator: "begins_with" },
    });
    expect(result).toEqual({ "#pk": "pk", "#sk": "sk" });
  });
});
