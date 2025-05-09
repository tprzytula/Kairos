import { DynamoDBTable } from "../../enums";

export interface IGetItemOptions {
  tableName: DynamoDBTable;
  item: {
    [key: string]: string;
  };
}
