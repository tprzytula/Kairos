import { Migration } from "../types";

export const loadMigrationsFromDirectory = async (migrationsPath: string): Promise<Migration[]> => {
  const fs = require('fs');
  const path = require('path');
  
  if (!fs.existsSync(migrationsPath)) {
    console.log(`Migrations directory ${migrationsPath} does not exist`);
    return [];
  }

  const entries = fs.readdirSync(migrationsPath, { withFileTypes: true });
  
  // Get both directory-based migrations and single file migrations
  const migrationSources: string[] = [];
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Directory-based migration (e.g., "001_add_grocery_defaults/")
      const indexPath = path.join(migrationsPath, entry.name, 'index.ts');
      const indexJsPath = path.join(migrationsPath, entry.name, 'index.js');
      
      if (fs.existsSync(indexPath) || fs.existsSync(indexJsPath)) {
        migrationSources.push(entry.name);
      }
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
      // Single file migration (legacy support)
      migrationSources.push(entry.name);
    }
  }
  
  // Sort by migration number/name
  migrationSources.sort();

  const migrations: Migration[] = [];

  for (const source of migrationSources) {
    try {
      let migrationPath: string;
      let displayName: string;
      
      if (source.includes('.')) {
        // Single file migration
        migrationPath = path.join(migrationsPath, source);
        displayName = source;
      } else {
        // Directory-based migration
        const indexTsPath = path.join(migrationsPath, source, 'index.ts');
        const indexJsPath = path.join(migrationsPath, source, 'index.js');
        
        migrationPath = fs.existsSync(indexTsPath) ? indexTsPath : indexJsPath;
        displayName = `${source}/index.${migrationPath.endsWith('.ts') ? 'ts' : 'js'}`;
      }
      
      const migrationModule = require(migrationPath);
      
      if (migrationModule.default && typeof migrationModule.default === 'object') {
        const migration = migrationModule.default as Migration;
        if (migration.id && migration.name && typeof migration.execute === 'function') {
          migrations.push(migration);
          console.log(`Loaded migration: ${migration.id} from ${displayName}`);
        } else {
          console.warn(`Invalid migration format in ${displayName}`);
        }
      } else {
        console.warn(`No default export found in ${displayName}`);
      }
    } catch (error) {
      console.error(`Failed to load migration from ${source}:`, error);
    }
  }

  return migrations;
};