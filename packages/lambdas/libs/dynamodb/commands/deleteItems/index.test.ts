import { deleteItems } from ".";
import { DynamoDBTable } from "../../enums";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { createMockDocumentClient } from "../../testUtils";

vi.mock("../../client");
vi.mock("@aws-sdk/lib-dynamodb");

describe("Given the deleteItems function", () => {
  it("should pass the right table name and ids to the deleteItems command", async () => {
    createMockDocumentClient();

    await deleteItems({ ids: ["1", "2"], tableName: DynamoDBTable.GROCERY_LIST });

    expect(BatchWriteCommand).toHaveBeenCalledWith({
      RequestItems: {
        [DynamoDBTable.GROCERY_LIST]: [
          {
            DeleteRequest: {
              Key: {
                id: '1',
              },
            },
          },
          {
            DeleteRequest: {
              Key: {
                id: '2',
              },
            },
          },
        ],
      },
    });
  });

  it("should return the response from the deleteItem command", async () => {
    createMockDocumentClient();

    const items = await deleteItems({
      ids: ["1", "2"],
      tableName: DynamoDBTable.GROCERY_LIST,
    });

    expect(items).toBe('send response');
  });
});
