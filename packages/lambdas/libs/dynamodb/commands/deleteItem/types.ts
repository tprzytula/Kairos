import { DynamoDBTables } from "../../enums";

export interface IDeleteItemOptions {
  id: string;
  tableName: DynamoDBTables;
}
