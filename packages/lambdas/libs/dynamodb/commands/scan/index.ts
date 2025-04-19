import { AttributeValue, ScanCommand } from "@aws-sdk/client-dynamodb";
import { IScanOptions } from "./types";
import { getClient } from "../../client";

export const scan = async ({
  tableName,
}: IScanOptions): Promise<Record<string, AttributeValue>[]> => {
  const client = getClient();
  const command = new ScanCommand({
    TableName: tableName,
  });

  const { Items } = await client.send(command);

  if (Items) {
    return Items;
  }

  return [];
};
