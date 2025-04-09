import { deleteItem } from ".";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBTables } from "../../enums";

jest.mock("@aws-sdk/client-dynamodb");

describe("Given the deleteItem function", () => {
  it("should pass the right table name and id to the deleteItem command", async () => {
    jest
      .spyOn(DynamoDBClient.prototype, "send")
      .mockImplementation(async () => ({
        $metadata: {},
      }));

    await deleteItem({ id: "1", tableName: DynamoDBTables.GROCERY_LIST });

    expect(DeleteItemCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTables.GROCERY_LIST,
      Key: {
        id: {
          S: "1",
        },
      },
    });
  });

  it("should return the response from the deleteItem command", async () => {
    jest
      .spyOn(DynamoDBClient.prototype, "send")
      .mockImplementation(async () => ({
        $metadata: {},
      }));

    const items = await deleteItem({
      id: "1",
      tableName: DynamoDBTables.GROCERY_LIST,
    });

    expect(items).toEqual({
      $metadata: {},
    });
  });
});
