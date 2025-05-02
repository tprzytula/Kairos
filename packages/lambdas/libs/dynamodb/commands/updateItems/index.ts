import { IUpdateItemsOptions } from "./types";
import { getDocumentClient } from "../../client";
import { BatchWriteCommand, BatchWriteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { getUpdateExpression, getExpressionAttributeValues } from "../updateItem/utils";

export const updateItems = async ({
  items,
  tableName,
}: IUpdateItemsOptions): Promise<BatchWriteCommandOutput> => {
  const documentClient = getDocumentClient();

  console.debug('update payload', {
    RequestItems: {
      [tableName]: items.map(({ id, fieldsToUpdate }) => ({
        UpdateRequest: {
          Key: {
            id,
          },
          UpdateExpression: getUpdateExpression(fieldsToUpdate),
          ExpressionAttributeValues: getExpressionAttributeValues(fieldsToUpdate),
        },
      })),
    },
  })

  const command = new BatchWriteCommand({
    RequestItems: {
      [tableName]: items.map(({ id, fieldsToUpdate }) => ({
        UpdateRequest: {
          Key: {
            id,
          },
          UpdateExpression: getUpdateExpression(fieldsToUpdate),
          ExpressionAttributeValues: getExpressionAttributeValues(fieldsToUpdate),
        },
      })),
    },
  });

  return await documentClient.send(command);
};
