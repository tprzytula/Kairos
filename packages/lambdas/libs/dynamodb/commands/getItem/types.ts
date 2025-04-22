import { DynamoDBTables } from "../../enums";

export interface IGetItemOptions {
  tableName: DynamoDBTables;
  item: {
    [key: string]: string;
  };
}
