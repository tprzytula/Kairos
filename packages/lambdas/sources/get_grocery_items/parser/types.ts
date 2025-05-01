import { AttributeValue } from "@aws-sdk/client-dynamodb";

export interface IDynamoDBGroceryItem extends Record<string, AttributeValue> {
  quantity: { N: string };
  id: { S: string };
  name: { S: string };
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
}
