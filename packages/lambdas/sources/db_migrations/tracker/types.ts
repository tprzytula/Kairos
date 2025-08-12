export interface MigrationRecord {
  [key: string]: string | number | boolean | undefined;
  id: string;
  name: string;
  executedAt: string;
  checksum: string;
}

export interface LastMigrationRecord {
  [key: string]: string | number | boolean | undefined;
  id: string;
  lastMigrationId: string;
  lastMigrationName: string;
  lastExecutedAt: string;
  totalExecuted: number;
}