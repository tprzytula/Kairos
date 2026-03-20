import { deleteItem } from ".";
import { DynamoDBTable } from "../../enums";
import * as Client from '../../client';
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

vi.mock("../../client");
vi.mock("@aws-sdk/lib-dynamodb");

describe("Given the deleteItem function", () => {
  it("should pass the right table name and id to the deleteItem command", async () => {
    mockDocumentClient();

    await deleteItem({ key: { id: "1" }, tableName: DynamoDBTable.GROCERY_LIST });

    expect(DeleteCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      Key: {
        id: '1',
      },
    });
  });

  it("should return the response from the deleteItem command", async () => {
    mockDocumentClient();

    const items = await deleteItem({
      key: { id: "1" },
      tableName: DynamoDBTable.GROCERY_LIST,
    });

    expect(items).toBe('send response');
  });
});

const mockDocumentClient = () => {
  const mockDocumentClient = {
    send: vi.fn().mockResolvedValue('send response'),
  } as unknown as DynamoDBDocumentClient;

  vi.spyOn(Client, "getDocumentClient").mockReturnValue(mockDocumentClient);

  return mockDocumentClient;
};
