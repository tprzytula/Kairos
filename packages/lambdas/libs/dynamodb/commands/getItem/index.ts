import { getDocumentClient } from "../../client";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { IGetItemOptions } from "./types";

export const getItem = async <T>({
  item,
  tableName,
}: IGetItemOptions): Promise<T | null> => {
  const documentClient = getDocumentClient();

  const command = new GetCommand({
    TableName: tableName,
    Key: item,
  });

  const { Item } = await documentClient.send(command);

  return Item as T | null;
};
