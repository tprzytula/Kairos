import { getItem } from ".";
import { DynamoDBTable } from "../../enums";
import * as Client from '../../client';
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

jest.mock("../../client");
jest.mock("@aws-sdk/lib-dynamodb");

describe("Given the getItem function", () => {
  it("should pass the right table name and id to the getItem command", async () => {
    mockDocumentClient();

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
    mockDocumentClient();

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

const mockDocumentClient = () => {
  const mockDocumentClient = {
    send: jest.fn().mockResolvedValue({
      Item: {
        id: "1",
        name: "test",
        unit: "test",
        quantity: "1",
        imagePath: "test",
      },
    }),
  } as unknown as DynamoDBDocumentClient;

  jest.spyOn(Client, "getDocumentClient").mockReturnValue(mockDocumentClient);

  return mockDocumentClient;
};
