import { DynamoDBTable } from "../../enums";

export interface IUpdateItem {
  id: string;
  fieldsToUpdate: Record<string, string | boolean>;
}

export interface IUpdateItemsOptions {
  tableName: DynamoDBTable;
  items: Array<IUpdateItem>;
}
