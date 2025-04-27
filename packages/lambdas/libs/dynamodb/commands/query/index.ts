import { getDocumentClient } from "../../client";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getKeyConditionExpression, getExpressionAttributeValues, getExpressionAttributeNames } from "./utils";
import { TableResponseMap } from "../types";
import { IQueryOptions } from "./types";

export const query = async <T extends keyof TableResponseMap>({
  attributes,
  tableName,
  indexName,
}: IQueryOptions & { tableName: T }): Promise<Array<TableResponseMap[T]>> => {
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
    return [] as Array<TableResponseMap[T]>;
  }

  return Items as Array<TableResponseMap[T]>;
};
