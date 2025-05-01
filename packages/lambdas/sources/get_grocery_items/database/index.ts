import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBGroceryItem } from "./types";

const client = new DynamoDBClient({ region: "eu-west-2" });

export const getItems = async (): Promise<Array<DynamoDBGroceryItem>> => {
  const command = new ScanCommand({
    TableName: "grocery_list",
  });

  const { Items } = (await client.send(command)) ?? {};

  if (Items) {
    return Items as unknown as Array<DynamoDBGroceryItem>;
  }

  return [];
};
