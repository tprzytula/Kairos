import { deleteItem } from ".";
import { DynamoDBTable } from "../../enums";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { createMockDocumentClient } from "../../testUtils";

vi.mock("../../client");
vi.mock("@aws-sdk/lib-dynamodb");

describe("Given the deleteItem function", () => {
  it("should pass the right table name and id to the deleteItem command", async () => {
    createMockDocumentClient();

    await deleteItem({ key: { id: "1" }, tableName: DynamoDBTable.GROCERY_LIST });

    expect(DeleteCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      Key: {
        id: '1',
      },
    });
  });

  it("should return the response from the deleteItem command", async () => {
    createMockDocumentClient();

    const items = await deleteItem({
      key: { id: "1" },
      tableName: DynamoDBTable.GROCERY_LIST,
    });

    expect(items).toBe('send response');
  });
});
