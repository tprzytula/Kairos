export interface DynamoDBGroceryItem {
  quantity: { N: string };
  id: { S: string };
  name: { S: string };
}
