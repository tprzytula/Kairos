import { deleteItems } from ".";
import { DynamoDBTable } from "../../enums";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { createMockDocumentClient } from "../../testUtils";

vi.mock("../../client");
vi.mock("@aws-sdk/lib-dynamodb");

describe("Given the deleteItems function", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should pass the right table name and ids to the deleteItems command", async () => {
    createMockDocumentClient();

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
    createMockDocumentClient();

    const items = await deleteItems({
      ids: ["1", "2"],
      tableName: DynamoDBTable.GROCERY_LIST,
    });

    expect(items).toBe('send response');
  });

  it("should chunk deletes into batches of 25 when more than 25 items are passed", async () => {
    const mock = createMockDocumentClient();
    const ids = Array.from({ length: 30 }, (_, i) => String(i + 1));

    await deleteItems({ ids, tableName: DynamoDBTable.GROCERY_LIST });

    expect(mock.send).toHaveBeenCalledTimes(2);
    expect(BatchWriteCommand).toHaveBeenCalledTimes(2);

    const firstCallArgs = vi.mocked(BatchWriteCommand).mock.calls[0][0];
    const secondCallArgs = vi.mocked(BatchWriteCommand).mock.calls[1][0];

    expect(firstCallArgs.RequestItems[DynamoDBTable.GROCERY_LIST]).toHaveLength(25);
    expect(secondCallArgs.RequestItems[DynamoDBTable.GROCERY_LIST]).toHaveLength(5);
  });

  it("should handle exactly 25 items in a single batch", async () => {
    const mock = createMockDocumentClient();
    const ids = Array.from({ length: 25 }, (_, i) => String(i + 1));

    await deleteItems({ ids, tableName: DynamoDBTable.GROCERY_LIST });

    expect(mock.send).toHaveBeenCalledTimes(1);
  });

  it("should handle empty ids array", async () => {
    const mock = createMockDocumentClient();

    const result = await deleteItems({ ids: [], tableName: DynamoDBTable.GROCERY_LIST });

    expect(mock.send).not.toHaveBeenCalled();
    expect(result).toStrictEqual({ $metadata: {} });
  });
});
