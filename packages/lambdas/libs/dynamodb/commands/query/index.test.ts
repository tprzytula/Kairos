import { query } from ".";
import { DynamoDBTable } from "../../enums";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { createMockDocumentClient } from "../../testUtils";
import * as Client from '../../client';
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

vi.mock("../../client");
vi.mock('@aws-sdk/lib-dynamodb');

describe("Given the query command", () => {
  it('should create a query command with the right table name and attributes', async () => {
    createMockDocumentClient({ Items: [EXAMPLE_ITEM] });

    await query({
      tableName: DynamoDBTable.GROCERY_LIST,
      indexName: "test",
      attributes: { name: "test" },
    });

    expect(QueryCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      IndexName: "test",
      KeyConditionExpression: "#name = :name",
      ExpressionAttributeValues: { ":name": "test" },
      ExpressionAttributeNames: { "#name": "name" },
    });
  });

  it("should return the items", async () => {
    createMockDocumentClient({ Items: [EXAMPLE_ITEM] });

    const items = await query({
      tableName: DynamoDBTable.GROCERY_LIST,
      indexName: "test",
      attributes: { name: "test" },
    });

    expect(items).toEqual([EXAMPLE_ITEM]);
  });

  describe("When there are no items", () => {
    it("should return an empty array", async () => {
      createMockDocumentClient({ Items: [] });

      const items = await query({
        tableName: DynamoDBTable.GROCERY_LIST,
        indexName: "test",
        attributes: { name: "test" },
      });

      expect(items).toEqual([]);
    });
  });

  describe("When Items is undefined", () => {
    it("should return an empty array", async () => {
      createMockDocumentClient({ Items: undefined });

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
