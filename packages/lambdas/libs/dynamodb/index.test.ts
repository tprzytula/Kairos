import { DynamoDBTable, scan } from ".";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

vi.mock("@aws-sdk/lib-dynamodb", async () => ({
  ...(await vi.importActual("@aws-sdk/lib-dynamodb")),
  ScanCommand: vi.fn(),
}));

describe("Given the scan function", () => {
  it("should pass the right table name to the scan command", async () => {
    vi
      .spyOn(DynamoDBDocumentClient.prototype, "send")
      .mockImplementation(async () => ({
        Items: [],
        $metadata: {},
      }));

    await scan({ tableName: DynamoDBTable.GROCERY_LIST });

    expect(ScanCommand).toHaveBeenCalledWith({
      TableName: DynamoDBTable.GROCERY_LIST,
    });
  });

  it("should return the items", async () => {
    vi
      .spyOn(DynamoDBDocumentClient.prototype, "send")
      .mockImplementation(async () => ({
        Items: [
          {
            id: "1",
            name: "Item 1",
            quantity: 1,
          },
        ],
        $metadata: {},
      }));

    const items = await scan({ tableName: DynamoDBTable.GROCERY_LIST });

    expect(items).toEqual([
      {
        id: "1",
        name: "Item 1",
        quantity: 1,
      },
    ]);
  });

  it("should return an empty array if no items are found", async () => {
    vi
      .spyOn(DynamoDBDocumentClient.prototype, "send")
      .mockImplementation(async () => ({
        Items: undefined,
        $metadata: {},
      }));

    const items = await scan({ tableName: DynamoDBTable.GROCERY_LIST });

    expect(items).toEqual([]);
  });
});
