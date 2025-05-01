import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const REGION = "eu-west-2";

export class DynamoDBClientFactory {
  private static instance: DynamoDBClientFactory;
  private client: DynamoDBClient | null = null;
  private documentClient: DynamoDBDocumentClient | null = null;

  public static getInstance(): DynamoDBClientFactory {
    if (!DynamoDBClientFactory.instance) {
      DynamoDBClientFactory.instance = new DynamoDBClientFactory();
    }
    return DynamoDBClientFactory.instance;
  }

  public get dynamoDBClient(): DynamoDBClient {
    if (!this.client) {
      this.client = new DynamoDBClient({ region: REGION });
    }
    return this.client;
  }

  public get dynamoDBDocumentClient(): DynamoDBDocumentClient {
    if (!this.documentClient) {
      this.documentClient = DynamoDBDocumentClient.from(this.dynamoDBClient);
    }
    return this.documentClient;
  }
}
