import { DynamoDBTable, getItem } from "@kairos-lambdas-libs/dynamodb";
import { IUserPreferences } from "@kairos-lambdas-libs/dynamodb/types";

export const getUserPreferences = async (userId: string): Promise<IUserPreferences> => {
  try {
    const preferences = await getItem({
      tableName: DynamoDBTable.USER_PREFERENCES,
      item: { userId },
    });

    // Return preferences if found, otherwise return default preferences
    return preferences || {
      userId,
      currentProjectId: undefined,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error(`Failed to get preferences for user ${userId}:`, error);
    
    // Return default preferences on error
    return {
      userId,
      currentProjectId: undefined,
      lastUpdated: Date.now(),
    };
  }
};
