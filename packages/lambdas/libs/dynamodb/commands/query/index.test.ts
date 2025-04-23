import { query } from ".";
import { DynamoDBTable } from "../../enums";
import * as Client from '../../client';
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

jest.mock("../../client");
jest.mock('@aws-sdk/lib-dynamodb');

describe("Given the query command", () => {
  it('should create a query command with the right table name and attributes', async () => {
    mockDocumentClient();

    await query({
      tableName: DynamoDBTable.GROCERY_LIST,
      indexName: "test",
      attributes: { name: "test" },
    });

    expect(QueryCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      IndexName: "test",
      KeyConditionExpression: "name = :name",
      ExpressionAttributeValues: { ":name": "test" },
    });
  });

  it("should return the items", async () => {
    mockDocumentClient();

    const items = await query({
      tableName: DynamoDBTable.GROCERY_LIST,
      indexName: "test",
      attributes: { name: "test" },
    });

    expect(items).toEqual([EXAMPLE_ITEM]);
  });

  describe("When there are no items", () => {
    it("should return an empty array", async () => {
      mockDocumentClient([]);

      const items = await query({
        tableName: DynamoDBTable.GROCERY_LIST,
        indexName: "test",
        attributes: { name: "test" },
      });

      expect(items).toEqual([]);
    });
  });
});

const EXAMPLE_ITEM = {
  id: "1",
  name: "test",
};

const mockDocumentClient = (Items: Array<unknown> = [EXAMPLE_ITEM]) => {
  const mockDocumentClient = {
    send: jest.fn().mockResolvedValue({
      Items,
    }),
  } as unknown as DynamoDBDocumentClient;

  jest.spyOn(Client, "getDocumentClient").mockReturnValue(mockDocumentClient);

  return mockDocumentClient;
};
