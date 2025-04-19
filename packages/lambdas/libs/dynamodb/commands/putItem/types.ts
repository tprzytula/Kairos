import { DynamoDBTables } from "../../enums";

export interface IPutItemOptions {
  tableName: DynamoDBTables;
  item: {
    [key: string]: string;
  };
}
