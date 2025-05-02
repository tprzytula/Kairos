import { IUpdateItemsOptions } from "./types";
import { getDocumentClient } from "../../client";
import { BatchWriteCommand, BatchWriteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { getUpdateExpression, getExpressionAttributeValues } from "../updateItem/utils";

export const updateItems = async ({
  items,
  tableName,
}: IUpdateItemsOptions): Promise<BatchWriteCommandOutput> => {
  const documentClient = getDocumentClient();
  const command = new BatchWriteCommand({
    RequestItems: {
      [tableName]: items.map(({ id, updatedFields }) => ({
        UpdateRequest: {
          Key: {
            id,
          },
          UpdateExpression: getUpdateExpression(updatedFields),
          ExpressionAttributeValues: getExpressionAttributeValues(updatedFields),
        },
      })),
    },
  });

  return await documentClient.send(command);
};
