import { scan } from ".";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBTables } from "../../enums";

jest.mock('@aws-sdk/client-dynamodb');

describe('Given the scan function', () => {
  it('should pass the right table name to the scan command', async () => {
    jest.spyOn(DynamoDBClient.prototype, 'send').mockImplementation(async () => ({
        Items: [],
        $metadata: {},
    }))

    await scan({ tableName: DynamoDBTables.GROCERY_LIST });

    expect(ScanCommand).toHaveBeenCalledWith({
        TableName: DynamoDBTables.GROCERY_LIST,
    });
  });

  it('should return the items', async () => {
    jest.spyOn(DynamoDBClient.prototype, 'send').mockImplementation(async () => ({
        Items: [
          {
            id: { S: '1' },
            name: { S: 'Item 1' },
            quantity: { N: '1' },
          },
        ],
        $metadata: {},
    }));

    const items = await scan({ tableName: DynamoDBTables.GROCERY_LIST });

    expect(items).toEqual([
      {
        id: { S: '1' },
        name: { S: 'Item 1' },
        quantity: { N: '1' },
      },
    ]);
  });

  it('should return an empty array if no items are found', async () => {
    jest.spyOn(DynamoDBClient.prototype, 'send').mockImplementation(async () => ({
      Items: undefined,
      $metadata: {},
    }));

    const items = await scan({ tableName: DynamoDBTables.GROCERY_LIST });

    expect(items).toEqual([]);
  });
});