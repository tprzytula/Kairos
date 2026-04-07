import { DynamoDBTable } from "../../enums";
import { AttributeValue } from "./utils";

export interface IQueryOptions {
  tableName: DynamoDBTable;
  indexName: string;
  attributes: {
    [key: string]: string | AttributeValue;
  };
}
