import { DeleteItemCommand, DeleteItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { IDeleteItemOptions } from "./types";
import { client } from "../../client";

export const deleteItem = async ({
  id,
  tableName,
}: IDeleteItemOptions): Promise<DeleteItemCommandOutput> => {
  const command = new DeleteItemCommand({
    TableName: tableName,
    Key: {
      id: {
        S: id,
      },
    },
  });

  return await client.send(command);
};
