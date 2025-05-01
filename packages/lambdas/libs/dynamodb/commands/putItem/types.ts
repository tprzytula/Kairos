import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { DynamoDBTables } from "../../enums";

export interface IPutItemOptions {
  tableName: DynamoDBTables;
  item: Record<string, AttributeValue>;
}
