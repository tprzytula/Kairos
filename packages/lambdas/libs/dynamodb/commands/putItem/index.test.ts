import { putItem } from ".";
import { DynamoDBTable } from "../../enums";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { createMockDocumentClient } from "../../testUtils";

vi.mock("../../client");
vi.mock("@aws-sdk/lib-dynamodb");

describe("Given the putItem function", () => {
  it("should pass the right table name and id to the putItem command", async () => {
    createMockDocumentClient();

    await putItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      item: {
        id: "1",
      },
    });

    expect(PutCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      Item: {
          id: "1"
      },
    });
  });

  it("should return the response from the putItem command", async () => {
    createMockDocumentClient();

    const items = await putItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      item: {
        id: "1",
      },
    });

    expect(items).toBe('send response');
  });
});
