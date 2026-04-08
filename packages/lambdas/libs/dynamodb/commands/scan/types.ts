import { DynamoDBTable } from "../../enums";

export interface IScanOptions {
  tableName: DynamoDBTable;
  filterExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  expressionAttributeValues?: Record<string, unknown>;
}
