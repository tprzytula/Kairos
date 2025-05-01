import { DynamoDBTable } from "../../enums";

export interface IPutItemOptions {
  tableName: DynamoDBTable;
  item: {
    [key: string]: string | number | boolean | undefined;
  };
}
