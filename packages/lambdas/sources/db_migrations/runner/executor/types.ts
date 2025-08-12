import { Migration, MigrationResult } from "../types";

export interface MigrationExecutor {
  executeMigration: (migration: Migration) => Promise<MigrationResult>;
  generateMigrationContent: (migration: Migration) => string;
}