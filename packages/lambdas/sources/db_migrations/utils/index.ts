import { getLastExecutedMigration, getExecutedMigrations } from "../tracker";
import { LastMigrationStatus } from "./types";

export const getLastMigrationStatus = async (): Promise<LastMigrationStatus> => {
  const lastMigration = await getLastExecutedMigration();
  
  if (!lastMigration) {
    return {
      hasExecutedMigrations: false,
      message: "No migrations have been executed yet",
    };
  }

  return {
    hasExecutedMigrations: true,
    lastMigrationId: lastMigration.lastMigrationId,
    lastMigrationName: lastMigration.lastMigrationName,
    lastExecutedAt: lastMigration.lastExecutedAt,
    totalExecuted: lastMigration.totalExecuted,
    message: `Last migration: ${lastMigration.lastMigrationId} (${lastMigration.lastMigrationName}) executed at ${lastMigration.lastExecutedAt}`,
  };
};

export const getAllExecutedMigrations = async () => {
  return await getExecutedMigrations();
};