import { LastMigrationRecord, MigrationRecord } from "../tracker/types";

export interface LastMigrationStatus {
  hasExecutedMigrations: boolean;
  lastMigrationId?: string;
  lastMigrationName?: string;
  lastExecutedAt?: string;
  totalExecuted?: number;
  message: string;
}