import { IUpdateItemOptions } from "./types";
import { getDocumentClient } from "../../client";
import { UpdateCommand, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import { getUpdateExpression, getExpressionAttributeNames, getExpressionAttributeValues } from "./utils";

export const updateItem = async ({
  key,
  updatedFields,
  tableName,
}: IUpdateItemOptions): Promise<UpdateCommandOutput> => {
  const documentClient = getDocumentClient();

  return await documentClient.send(new UpdateCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: getUpdateExpression(updatedFields),
    ExpressionAttributeNames: getExpressionAttributeNames(updatedFields),
    ExpressionAttributeValues: getExpressionAttributeValues(updatedFields),
  }));
};
