import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { IUserPreferences } from "@kairos-lambdas-libs/dynamodb/types";
import { IRequestBody } from "../body/types";

export const updateUserPreferences = async (userId: string, updates: IRequestBody): Promise<IUserPreferences> => {
  const updatedPreferences: IUserPreferences = {
    userId,
    currentProjectId: updates.currentProjectId,
    currentShopId: updates.currentShopId,
    lastUpdated: Date.now(),
  };

  await putItem({
    tableName: DynamoDBTable.USER_PREFERENCES,
    item: updatedPreferences,
  });

  return updatedPreferences;
};
