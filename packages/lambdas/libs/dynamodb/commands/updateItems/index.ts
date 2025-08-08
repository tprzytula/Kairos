import { IUpdateItemsOptions } from "./types";
import { getDocumentClient } from "../../client";
import { TransactWriteCommand, TransactWriteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { getUpdateExpression, getExpressionAttributeNames, getExpressionAttributeValues } from "../updateItem/utils";

export const updateItems = async ({
  items,
  tableName,
}: IUpdateItemsOptions): Promise<TransactWriteCommandOutput> => {
  const documentClient = getDocumentClient();
  const transactionItems = items.map(({ id, fieldsToUpdate }) => ({
    Update: {
      TableName: tableName,
      Key: { id },
      UpdateExpression: getUpdateExpression(fieldsToUpdate),
      ExpressionAttributeNames: getExpressionAttributeNames(fieldsToUpdate),
      ExpressionAttributeValues: getExpressionAttributeValues(fieldsToUpdate),
    }
  }));

  console.debug('update payload', JSON.stringify(transactionItems, null, 2));

  return await documentClient.send(new TransactWriteCommand({
    TransactItems: transactionItems
  }));
};
