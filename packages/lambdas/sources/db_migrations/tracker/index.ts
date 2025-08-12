import { DynamoDBTable, getItem, putItem, scan } from "@kairos-lambdas-libs/dynamodb";
import { MigrationRecord, LastMigrationRecord } from "./types";
import { createHash } from "crypto";

export const getExecutedMigrations = async (): Promise<MigrationRecord[]> => {
  try {
    const items = await scan({
      tableName: DynamoDBTable.MIGRATIONS,
    });
    return items as MigrationRecord[];
  } catch (error) {
    console.log("Migrations table might not exist yet, returning empty array");
    return [];
  }
};

export const getMigration = async (id: string): Promise<MigrationRecord | null> => {
  try {
    return await getItem<MigrationRecord>({
      tableName: DynamoDBTable.MIGRATIONS,
      item: { id },
    });
  } catch (error) {
    console.log(`Migration ${id} not found or table doesn't exist`);
    return null;
  }
};

export const generateChecksum = (content: string): string => {
  return createHash('sha256').update(content).digest('hex');
};

export const recordMigration = async (id: string, name: string, migrationContent: string): Promise<void> => {
  const checksum = generateChecksum(migrationContent);
  const record: MigrationRecord = {
    id,
    name,
    executedAt: new Date().toISOString(),
    checksum,
  };

  await putItem({
    tableName: DynamoDBTable.MIGRATIONS,
    item: record,
  });
};

export const isMigrationExecuted = async (id: string): Promise<boolean> => {
  const migration = await getMigration(id);
  const result = Boolean(migration);
  console.log(`DEBUG isMigrationExecuted: id=${id}, migration=`, migration);
  console.log(`DEBUG isMigrationExecuted: Boolean(migration) = ${result}`);
  return result;
};

export const validateMigrationChecksum = async (id: string, content: string): Promise<boolean> => {
  const migration = await getMigration(id);
  if (!migration) return true;
  
  const expectedChecksum = generateChecksum(content);
  return migration.checksum === expectedChecksum;
};

export const getLastExecutedMigration = async (): Promise<LastMigrationRecord | null> => {
  try {
    return await getItem<LastMigrationRecord>({
      tableName: DynamoDBTable.MIGRATIONS,
      item: { id: "LAST_MIGRATION" },
    });
  } catch (error) {
    console.log("Last migration record not found");
    return null;
  }
};

export const updateLastExecutedMigration = async (migrationId: string, migrationName: string): Promise<void> => {
  const executedMigrations = await getExecutedMigrations();
  
  const lastMigrationRecord: LastMigrationRecord = {
    id: "LAST_MIGRATION",
    lastMigrationId: migrationId,
    lastMigrationName: migrationName,
    lastExecutedAt: new Date().toISOString(),
    totalExecuted: executedMigrations.length,
  };

  await putItem({
    tableName: DynamoDBTable.MIGRATIONS,
    item: lastMigrationRecord,
  });
};