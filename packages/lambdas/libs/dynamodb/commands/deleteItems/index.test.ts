import { deleteItems } from ".";
import { DynamoDBTable } from "../../enums";
import * as Client from '../../client';
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

jest.mock("../../client");
jest.mock("@aws-sdk/lib-dynamodb");

describe("Given the deleteItems function", () => {
  it("should pass the right table name and ids to the deleteItems command", async () => {
    mockDocumentClient();

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
    mockDocumentClient();

    const items = await deleteItems({
      ids: ["1", "2"],
      tableName: DynamoDBTable.GROCERY_LIST,
    });

    expect(items).toBe('send response');
  });
});

const mockDocumentClient = () => {
  const mockDocumentClient = {
    send: jest.fn().mockResolvedValue('send response'),
  } as unknown as DynamoDBDocumentClient;

  jest.spyOn(Client, "getDocumentClient").mockReturnValue(mockDocumentClient);

  return mockDocumentClient;
};
