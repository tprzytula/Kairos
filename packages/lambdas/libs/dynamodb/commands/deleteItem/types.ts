import { DynamoDBTable } from "../../enums";

export interface IDeleteItemOptions {
  key: Record<string, string>;
  tableName: DynamoDBTable;
}
