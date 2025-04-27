import { IScanOptions } from "./types";
import { getDocumentClient } from "../../client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { TableResponseMap } from "../types";

export const scan = async <T extends keyof TableResponseMap>({
  tableName,
}: IScanOptions & { tableName: T }): Promise<Array<TableResponseMap[T]>> => {
  const documentClient = getDocumentClient();

  const command = new ScanCommand({
    TableName: tableName,
  });

  const { Items } = await documentClient.send(command);

  if (!Items) {
    return [] as Array<TableResponseMap[T]>;
  }

  return Items as Array<TableResponseMap[T]>;
};
