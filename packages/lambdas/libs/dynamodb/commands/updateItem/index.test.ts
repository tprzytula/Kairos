import { updateItem } from ".";
import { DynamoDBTable } from "../../enums";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createMockDocumentClient } from "../../testUtils";

vi.mock("../../client");
vi.mock("@aws-sdk/lib-dynamodb");

describe("Given the putItem function", () => {
  it("should pass the right table name and id to the putItem command", async () => {
    createMockDocumentClient();

    await updateItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      key: {
        id: "1",
      },
      updatedFields: {
        name: "John Doe",
        quantity: "1",
      },
    });

    expect(UpdateCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      Key: {
        id: "1",
      },
      UpdateExpression: "set #name = :name, #quantity = :quantity",
      ExpressionAttributeNames: {
        "#name": "name",
        "#quantity": "quantity",
      },
      ExpressionAttributeValues: {
        ":name": "John Doe",
        ":quantity": "1",
      },
    });
  });

  it("should omit ExpressionAttributeValues when all fields are null", async () => {
    createMockDocumentClient();

    await updateItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      key: {
        id: "1",
      },
      updatedFields: {
        time: null,
      },
    });

    expect(UpdateCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      Key: {
        id: "1",
      },
      UpdateExpression: "remove #time",
      ExpressionAttributeNames: {
        "#time": "time",
      },
    });
  });

  it("should return the response from the putItem command", async () => {
    createMockDocumentClient();

    const items = await updateItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      key: {
        id: "1",
      },
      updatedFields: {
        name: "John Doe",
      },
    });

    expect(items).toBe('send response');
  });
});
