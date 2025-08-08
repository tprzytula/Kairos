import { updateItem } from ".";
import { DynamoDBTable } from "../../enums";
import * as Client from '../../client';
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

jest.mock("../../client");
jest.mock("@aws-sdk/lib-dynamodb");

describe("Given the putItem function", () => {
  it("should pass the right table name and id to the putItem command", async () => {
    mockDocumentClient();

    await updateItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      key: {
        id: "1",
      },
      updatedFields: {
        name: "John Doe",
        quantity: "1",
      },
    });

    expect(UpdateCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      Key: {
        id: "1",
      },
      UpdateExpression: "set #name = :name, #quantity = :quantity",
      ExpressionAttributeNames: {
        "#name": "name",
        "#quantity": "quantity",
      },
      ExpressionAttributeValues: {
        ":name": "John Doe",
        ":quantity": "1",
      },
    });
  });

  it("should return the response from the putItem command", async () => {
    mockDocumentClient();

    const items = await updateItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      key: {
        id: "1",
      },
      updatedFields: {
        name: "John Doe",
      },
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
