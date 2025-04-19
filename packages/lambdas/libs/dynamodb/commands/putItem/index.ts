import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { IPutItemOptions } from "./types";
import { getDocumentClient } from "../../client";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const putItem = async ({
  item,
  tableName,
}: IPutItemOptions): Promise<PutItemCommandOutput> => {
  const documentClient = getDocumentClient();

  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });

  return await documentClient.send(command);
};
