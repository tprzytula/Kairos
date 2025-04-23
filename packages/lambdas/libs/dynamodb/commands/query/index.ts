import { getDocumentClient } from "../../client";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { IQueryOptions } from "./types";
import { getKeyConditionExpression, getExpressionAttributeValues, getExpressionAttributeNames } from "./utils";

export const query = async <T extends Record<string, any>>({
  attributes,
  tableName,
  indexName,
}: IQueryOptions): Promise<T[]> => {
  const documentClient = getDocumentClient();
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: getKeyConditionExpression(attributes),
    ExpressionAttributeValues: getExpressionAttributeValues(attributes),
    ExpressionAttributeNames: getExpressionAttributeNames(attributes),
  });

  const { Items } = await documentClient.send(command);

  if (!Items) {
    return [];
  }

  return Items as T[];
};
