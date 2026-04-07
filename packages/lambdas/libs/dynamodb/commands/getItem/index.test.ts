import { getItem } from ".";
import { DynamoDBTable } from "../../enums";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { createMockDocumentClient } from "../../testUtils";

vi.mock("../../client");
vi.mock("@aws-sdk/lib-dynamodb");

describe("Given the getItem function", () => {
  it("should pass the right table name and id to the getItem command", async () => {
    createMockDocumentClient({
      Item: {
        id: "1",
        name: "test",
        unit: "test",
        quantity: "1",
        imagePath: "test",
      },
    });

    await getItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      item: {
        id: "1",
      },
    });

    expect(GetCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      Key: {
          id: "1"
      },
    });
  });

  it("should return the response from the getItem command", async () => {
    createMockDocumentClient({
      Item: {
        id: "1",
        name: "test",
        unit: "test",
        quantity: "1",
        imagePath: "test",
      },
    });

    const items = await getItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      item: {
        id: "1",
      },
    });

    expect(items).toEqual({
      id: "1",
      name: "test",
      unit: "test",
      quantity: "1",
      imagePath: "test",
    });
  });
});
