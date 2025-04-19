import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBClientFactory } from "./factory";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const getDocumentClient = (): DynamoDBDocumentClient => {
  const instance = DynamoDBClientFactory.getInstance();

  return instance.dynamoDBDocumentClient;
};

export const getClient = (): DynamoDBClient => {
  const instance = DynamoDBClientFactory.getInstance();

  return instance.dynamoDBClient;
};
