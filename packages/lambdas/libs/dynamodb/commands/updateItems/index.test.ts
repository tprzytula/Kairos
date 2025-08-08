import { updateItems } from ".";
import { DynamoDBTable } from "../../enums";
import * as Client from '../../client';
import { TransactWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

jest.mock("../../client");
jest.mock("@aws-sdk/lib-dynamodb");

describe("Given the updateItems function", () => {
  it("should pass the right table name and items to the updateItems command", async () => {
    mockDocumentClient();

    await updateItems({ 
      items: [
        { id: "1", fieldsToUpdate: { isDone: true } }, 
        { id: "2", fieldsToUpdate: { isDone: false } }
      ], 
      tableName: DynamoDBTable.GROCERY_LIST 
    });

    expect(TransactWriteCommand).toHaveBeenCalledWith({
      TransactItems: [
        {
          Update: {
            TableName: DynamoDBTable.GROCERY_LIST,
            Key: { id: '1' },
            UpdateExpression: 'set #isDone = :isDone',
            ExpressionAttributeNames: { '#isDone': 'isDone' },
            ExpressionAttributeValues: { ':isDone': true },
          }
        },
        {
          Update: {
            TableName: DynamoDBTable.GROCERY_LIST,
            Key: { id: '2' },
            UpdateExpression: 'set #isDone = :isDone',
            ExpressionAttributeNames: { '#isDone': 'isDone' },
            ExpressionAttributeValues: { ':isDone': false },
          }
        }
      ]
    });
  });

  it("should return the response from the updateItems command", async () => {
    mockDocumentClient();

    const items = await updateItems({
      items: [
        { id: "1", fieldsToUpdate: { isDone: true } },
        { id: "2", fieldsToUpdate: { isDone: false } }
      ],
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
