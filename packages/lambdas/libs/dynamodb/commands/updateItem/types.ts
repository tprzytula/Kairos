import { DynamoDBTables } from "../../enums";

export interface IUpdateItemOptions {
  tableName: DynamoDBTables;
  key: {
    [key: string]: string;
  };
  updatedFields: {
    [key: string]: string;
  };
}
