import { getExpressionAttributeValues, getUpdateExpression, getExpressionAttributeNames } from ".";

describe("Given the getUpdateExpression function", () => {
  it("should return the update expression", () => {
    const updateExpression = getUpdateExpression({
      name: "John Doe",
      quantity: "1"
    });

    expect(updateExpression).toStrictEqual("set #name = :name, #quantity = :quantity");
  });

  it("should use REMOVE for null fields", () => {
    const updateExpression = getUpdateExpression({
      name: "John Doe",
      time: null
    });

    expect(updateExpression).toStrictEqual("set #name = :name remove #time");
  });

  it("should return only REMOVE when all fields are null", () => {
    const updateExpression = getUpdateExpression({
      time: null,
      location: null
    });

    expect(updateExpression).toStrictEqual("remove #time, #location");
  });
});

describe("Given the getExpressionAttributeNames function", () => {
  it("should return the expression attribute names", () => {
    const expressionAttributeNames = getExpressionAttributeNames({
      name: "John Doe",
      quantity: "1"
    });

    expect(expressionAttributeNames).toStrictEqual({
      "#name": "name",
      "#quantity": "quantity"
    });
  });

  it("should include names for both SET and REMOVE fields", () => {
    const expressionAttributeNames = getExpressionAttributeNames({
      name: "John Doe",
      time: null
    });

    expect(expressionAttributeNames).toStrictEqual({
      "#name": "name",
      "#time": "time"
    });
  });
});

describe("Given the getExpressionAttributeValues function", () => {
  it("should return the expression attribute values", () => {
    const expressionAttributeValues = getExpressionAttributeValues({
      name: "John Doe",
      quantity: "1"
    });

    expect(expressionAttributeValues).toStrictEqual({
      ":name": "John Doe",
      ":quantity": "1"
    });
  });

  it("should exclude null fields from values", () => {
    const expressionAttributeValues = getExpressionAttributeValues({
      name: "John Doe",
      time: null
    });

    expect(expressionAttributeValues).toStrictEqual({
      ":name": "John Doe"
    });
  });
});
