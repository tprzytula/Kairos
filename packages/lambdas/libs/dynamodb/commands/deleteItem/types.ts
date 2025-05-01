import { DynamoDBTable } from "../../enums";

export interface IDeleteItemOptions {
  id: string;
  tableName: DynamoDBTable;
}
