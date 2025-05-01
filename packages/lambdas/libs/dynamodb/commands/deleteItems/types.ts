import { DynamoDBTable } from "../../enums";

export interface IDeleteItemsOptions {
  ids: Array<string>;
  tableName: DynamoDBTable;
}
