import { DynamoDBTable } from "../../enums";

export interface IDeleteItemOptions {
  key: Record<string, string | number>;
  tableName: DynamoDBTable;
}
