import { IDeleteItemsOptions } from "./types";
import { getDocumentClient } from "../../client";
import { BatchWriteCommand, BatchWriteCommandOutput } from "@aws-sdk/lib-dynamodb";

const MAX_BATCH_SIZE = 25;

export const deleteItems = async ({
  ids,
  tableName,
}: IDeleteItemsOptions): Promise<BatchWriteCommandOutput> => {
  const documentClient = getDocumentClient();

  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += MAX_BATCH_SIZE) {
    chunks.push(ids.slice(i, i + MAX_BATCH_SIZE));
  }

  let lastResult: BatchWriteCommandOutput = { $metadata: {} };

  for (const chunk of chunks) {
    const command = new BatchWriteCommand({
      RequestItems: {
        [tableName]: chunk.map((id) => ({
          DeleteRequest: {
            Key: {
              id,
            },
          },
        })),
      },
    });

    lastResult = await documentClient.send(command);
  }

  return lastResult;
};
