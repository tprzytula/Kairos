import { putItem } from ".";
import { DynamoDBTable } from "../../enums";
import * as Client from '../../client';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

vi.mock("../../client");
vi.mock("@aws-sdk/lib-dynamodb");

describe("Given the putItem function", () => {
  it("should pass the right table name and id to the putItem command", async () => {
    mockDocumentClient();

    await putItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      item: {
        id: "1",
      },
    });

    expect(PutCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
      Item: {
          id: "1"
      },
    });
  });

  it("should return the response from the putItem command", async () => {
    mockDocumentClient();

    const items = await putItem({
      tableName: DynamoDBTable.GROCERY_LIST,
      item: {
        id: "1",
      },
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
