import { IDeleteItemsOptions } from "./types";
import { getDocumentClient } from "../../client";
import { BatchWriteCommand, BatchWriteCommandOutput } from "@aws-sdk/lib-dynamodb";

export const deleteItems = async ({
  ids,
  tableName,
}: IDeleteItemsOptions): Promise<BatchWriteCommandOutput> => {
  const documentClient = getDocumentClient();
  const command = new BatchWriteCommand({
    RequestItems: {
      [tableName]: ids.map((id) => ({
        DeleteRequest: {
          Key: {
            id,
          },
        },
      })),
    },
  });

  return await documentClient.send(command);
};
