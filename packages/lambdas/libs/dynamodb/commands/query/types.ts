import { DynamoDBTable } from "../../enums";

export interface IQueryOptions {
  tableName: DynamoDBTable;
  indexName: string;
  attributes: {
    [key: string]: string;
  };
}
