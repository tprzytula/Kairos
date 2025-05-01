import { PutItemCommand, PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { IPutItemOptions } from "./types";
import { client } from "../../client";

export const putItem = async ({
  item,
  tableName,
}: IPutItemOptions): Promise<PutItemCommandOutput> => {
  const command = new PutItemCommand({
    TableName: tableName,
    Item: item,
  });

  return await client.send(command);
};
