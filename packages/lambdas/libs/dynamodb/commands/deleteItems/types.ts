import { DynamoDBTables } from "../../enums";

export interface IDeleteItemsOptions {
  ids: Array<string>;
  tableName: DynamoDBTables;
}
