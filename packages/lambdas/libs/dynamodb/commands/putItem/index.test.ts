import { putItem } from ".";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBTables } from "../../enums";

jest.mock("@aws-sdk/client-dynamodb");

describe("Given the putItem function", () => {
  it("should pass the right table name and id to the putItem command", async () => {
    jest
      .spyOn(DynamoDBClient.prototype, "send")
      .mockImplementation(async () => ({
        $metadata: {},
      }));

    await putItem({
      tableName: DynamoDBTables.GROCERY_LIST,
      item: {
        id: {
          S: "1",
        },
      },
    });

    expect(PutItemCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTables.GROCERY_LIST,
      Item: {
        id: {
          S: "1",
        },
      },
    });
  });

  it("should return the response from the putItem command", async () => {
    jest
      .spyOn(DynamoDBClient.prototype, "send")
      .mockImplementation(async () => ({
        $metadata: {},
      }));

    const items = await putItem({
      tableName: DynamoDBTables.GROCERY_LIST,
      item: {
        id: {
          S: "1",
        },
      },
    });

    expect(items).toEqual({
      $metadata: {},
    });
  });
});
