import { DynamoDBClientFactory } from "./factory";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

vi.mock('./factory');

describe("Given the client", () => {
  describe("When getClient is called", () => {
    it("should return a DynamoDBClient instance", async () => {
      const mockClient = {} as DynamoDBClient;
      const mockFactory = {
        dynamoDBClient: mockClient
      };

      vi.spyOn(DynamoDBClientFactory, 'getInstance').mockReturnValue(mockFactory as any);

      const { getClient } = await import(".");
      const client = getClient();

      expect(client).toBe(mockClient);
    });
  });

  describe("When getDocumentClient is called", () => {
    it("should return a DynamoDBDocumentClient instance", async () => {
      const mockDocumentClient = {} as DynamoDBDocumentClient;
      const mockFactory = {
        dynamoDBDocumentClient: mockDocumentClient
      };

      vi.spyOn(DynamoDBClientFactory, 'getInstance').mockReturnValue(mockFactory as any);

      const { getDocumentClient } = await import(".");
      const documentClient = getDocumentClient();

      expect(documentClient).toBe(mockDocumentClient);
    });
  });
});
