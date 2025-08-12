import { Migration, MigrationResult } from "./types";
import { executeMigration } from "./executor";
import { loadMigrationsFromDirectory } from "./loader";

export const runMigrations = async (migrations: Migration[]): Promise<MigrationResult[]> => {
  const results: MigrationResult[] = [];
  
  console.log(`Starting migration run with ${migrations.length} migrations`);

  for (const migration of migrations) {
    try {
      const result = await executeMigration(migration);
      results.push(result);
      
      if (result.status === 'failed') {
        console.error(`Migration ${migration.id} failed, stopping execution`);
        break;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Unexpected error during migration ${migration.id}:`, errorMessage);
      
      results.push({
        id: migration.id,
        name: migration.name,
        status: 'failed',
        error: errorMessage,
      });
      break;
    }
  }

  console.log(`Migration run completed. Results:`, results);
  return results;
};

// Re-export loader function for easier access
export { loadMigrationsFromDirectory };