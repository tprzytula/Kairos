import { DynamoDBClientFactory } from ".";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
}));

jest.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest.fn(),
    }),
  },
}));

describe("Given the DynamoDBClientFactory", () => {
  describe("When getInstance is called", () => {
    it("should return the same instance on subsequent calls", () => {
      const instance1 = DynamoDBClientFactory.getInstance();
      const instance2 = DynamoDBClientFactory.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("When dynamoDBClient is accessed", () => {
    it("should create a new DynamoDBClient if one doesn't exist", () => {
      const factory = DynamoDBClientFactory.getInstance();
      const client = factory.dynamoDBClient;

      expect(DynamoDBClient).toHaveBeenCalledWith({ region: "eu-west-2" });
      expect(client).toBeDefined();
    });

    it("should return the same client instance on subsequent calls", () => {
      const factory = DynamoDBClientFactory.getInstance();
      const client1 = factory.dynamoDBClient;
      const client2 = factory.dynamoDBClient;

      expect(client1).toBe(client2);
    });
  });

  describe("When dynamoDBDocumentClient is accessed", () => {
    it("should create a new DynamoDBDocumentClient if one doesn't exist", () => {
      const factory = DynamoDBClientFactory.getInstance();
      const documentClient = factory.dynamoDBDocumentClient;

      expect(DynamoDBDocumentClient.from).toHaveBeenCalled();
      expect(documentClient).toBeDefined();
    });

    it("should return the same document client instance on subsequent calls", () => {
      const factory = DynamoDBClientFactory.getInstance();
      const documentClient1 = factory.dynamoDBDocumentClient;
      const documentClient2 = factory.dynamoDBDocumentClient;

      expect(documentClient1).toBe(documentClient2);
    });
  });
});
