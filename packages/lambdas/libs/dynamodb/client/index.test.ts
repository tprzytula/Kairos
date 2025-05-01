import { DynamoDBClientFactory } from "./factory";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

jest.mock('./factory');

describe("Given the client", () => {
  describe("When getClient is called", () => {
    it("should return a DynamoDBClient instance", () => {
      const mockClient = {} as DynamoDBClient;
      const mockFactory = {
        dynamoDBClient: mockClient
      };
      
      jest.spyOn(DynamoDBClientFactory, 'getInstance').mockReturnValue(mockFactory as any);
      
      const { getClient } = require(".");
      const client = getClient();
      
      expect(client).toBe(mockClient);
    });
  });

  describe("When getDocumentClient is called", () => {
    it("should return a DynamoDBDocumentClient instance", () => {
      const mockDocumentClient = {} as DynamoDBDocumentClient;
      const mockFactory = {
        dynamoDBDocumentClient: mockDocumentClient
      };
      
      jest.spyOn(DynamoDBClientFactory, 'getInstance').mockReturnValue(mockFactory as any);
      
      const { getDocumentClient } = require(".");
      const documentClient = getDocumentClient();
      
      expect(documentClient).toBe(mockDocumentClient);
    });
  });
});
