export interface Migration {
  id: string;
  name: string;
  execute: () => Promise<void>;
}

export interface MigrationResult {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'skipped';
  executedAt?: string;
  error?: string;
}

export interface MigrationRunner {
  run(): Promise<MigrationResult[]>;
}