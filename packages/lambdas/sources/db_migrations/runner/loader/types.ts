import { Migration } from "../types";

export interface MigrationLoader {
  loadMigrationsFromDirectory: (path: string) => Promise<Migration[]>;
}