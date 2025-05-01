import { getExpressionAttributeValues, getUpdateExpression } from ".";

describe("Given the getUpdateExpression function", () => {
  it("should return the update expression", () => {
    const updateExpression = getUpdateExpression({
      name: "John Doe",
      quantity: "1"
    });

    expect(updateExpression).toStrictEqual("set name = :name, quantity = :quantity");
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
});
