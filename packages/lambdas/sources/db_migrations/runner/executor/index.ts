import { Migration, MigrationResult } from "../types";
import { isMigrationExecuted, validateMigrationChecksum, recordMigration, updateLastExecutedMigration } from "../../tracker";

export const generateMigrationContent = (migration: Migration): string => {
  return JSON.stringify({
    id: migration.id,
    name: migration.name,
    execute: migration.execute.toString(),
  });
};

export const executeMigration = async (migration: Migration): Promise<MigrationResult> => {
  console.log(`Processing migration: ${migration.id} - ${migration.name}`);

  const isExecuted = await isMigrationExecuted(migration.id);
  
  if (isExecuted) {
    console.log(`Migration ${migration.id} already executed, skipping`);
    return {
      id: migration.id,
      name: migration.name,
      status: 'skipped',
    };
  }

  const migrationContent = generateMigrationContent(migration);
  const isValidChecksum = await validateMigrationChecksum(migration.id, migrationContent);

  if (!isValidChecksum) {
    const error = `Migration ${migration.id} checksum validation failed. Migration may have been modified after execution.`;
    console.error(error);
    return {
      id: migration.id,
      name: migration.name,
      status: 'failed',
      error,
    };
  }

  try {
    console.log(`Executing migration: ${migration.id}`);
    await migration.execute();
    
    await recordMigration(migration.id, migration.name, migrationContent);
    await updateLastExecutedMigration(migration.id, migration.name);

    const executedAt = new Date().toISOString();
    console.log(`Migration ${migration.id} executed successfully at ${executedAt}`);

    return {
      id: migration.id,
      name: migration.name,
      status: 'success',
      executedAt,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Migration ${migration.id} failed:`, errorMessage);
    
    return {
      id: migration.id,
      name: migration.name,
      status: 'failed',
      error: errorMessage,
    };
  }
};