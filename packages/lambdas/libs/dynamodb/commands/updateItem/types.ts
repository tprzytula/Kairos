import { DynamoDBTable } from "../../enums";

export interface IUpdateItemOptions {
  tableName: DynamoDBTable;
  key: {
    [key: string]: string;
  };
  updatedFields: {
    [key: string]: string | boolean;
  };
}
