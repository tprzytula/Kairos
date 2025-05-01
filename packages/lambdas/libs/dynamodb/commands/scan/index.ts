import { IScanOptions } from "./types";
import { getDocumentClient } from "../../client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const scan = async ({
  tableName,
}: IScanOptions): Promise<Record<string, unknown>[]> => {
  const documentClient = getDocumentClient();

  const command = new ScanCommand({
    TableName: tableName,
  });

  const { Items } = await documentClient.send(command);

  if (Items) {
    return Items;
  }

  return [];
};
