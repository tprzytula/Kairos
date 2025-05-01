import { IDeleteItemOptions } from "./types";
import { getDocumentClient } from "../../client";
import { DeleteCommand, DeleteCommandOutput } from "@aws-sdk/lib-dynamodb";

export const deleteItem = async ({
  id,
  tableName,
}: IDeleteItemOptions): Promise<DeleteCommandOutput> => {
  const documentClient = getDocumentClient();
  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      id,
    },
  });

  return await documentClient.send(command);
};
