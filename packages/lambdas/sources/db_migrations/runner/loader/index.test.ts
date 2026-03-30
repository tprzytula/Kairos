import { loadMigrationsFromDirectory } from './index';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('Migration Loader Functions', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'migration-loader-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('loadMigrationsFromDirectory', () => {
    it('should return empty array when directory does not exist', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
      const nonExistentPath = path.join(tmpDir, 'nonexistent');

      const migrations = await loadMigrationsFromDirectory(nonExistentPath);

      expect(migrations).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Migrations directory ${nonExistentPath} does not exist`,
      );
    });

    it('should load single-file .js migrations with valid default export', async () => {
      const migrationsDir = path.join(tmpDir, 'migrations');
      fs.mkdirSync(migrationsDir);

      const migrationContent = `
        module.exports = {
          default: {
            id: '001',
            name: 'Test Migration',
            execute: async function() {},
          },
        };
      `;
      fs.writeFileSync(path.join(migrationsDir, '001_test.js'), migrationContent);

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
      const migrations = await loadMigrationsFromDirectory(migrationsDir);

      expect(migrations).toHaveLength(1);
      expect(migrations[0].id).toBe('001');
      expect(migrations[0].name).toBe('Test Migration');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Loaded migration: 001 from 001_test.js',
      );
    });

    it('should load directory-based migrations with index.js', async () => {
      const migrationsDir = path.join(tmpDir, 'migrations');
      const migrationSubDir = path.join(migrationsDir, '001_dir_migration');
      fs.mkdirSync(migrationSubDir, { recursive: true });

      const migrationContent = `
        module.exports = {
          default: {
            id: '001',
            name: 'Directory Migration',
            execute: async function() {},
          },
        };
      `;
      fs.writeFileSync(path.join(migrationSubDir, 'index.js'), migrationContent);

      const migrations = await loadMigrationsFromDirectory(migrationsDir);

      expect(migrations).toHaveLength(1);
      expect(migrations[0].id).toBe('001');
      expect(migrations[0].name).toBe('Directory Migration');
    });

    it('should load directory-based migrations with index.ts (preferring .ts over .js)', async () => {
      const migrationsDir = path.join(tmpDir, 'migrations');
      const migrationSubDir = path.join(migrationsDir, '001_dir_migration');
      fs.mkdirSync(migrationSubDir, { recursive: true });

      const migrationContent = `
        module.exports = {
          default: {
            id: '001',
            name: 'TS Directory Migration',
            execute: async function() {},
          },
        };
      `;
      // Write both index.ts and index.js -- loader should prefer index.ts
      fs.writeFileSync(path.join(migrationSubDir, 'index.ts'), migrationContent);

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation();
      const migrations = await loadMigrationsFromDirectory(migrationsDir);

      expect(migrations).toHaveLength(1);
      expect(migrations[0].id).toBe('001');
      expect(migrations[0].name).toBe('TS Directory Migration');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Loaded migration: 001 from 001_dir_migration/index.ts',
      );
    });

    it('should skip directories without index.ts or index.js', async () => {
      const migrationsDir = path.join(tmpDir, 'migrations');
      const emptySubDir = path.join(migrationsDir, '001_empty');
      fs.mkdirSync(emptySubDir, { recursive: true });
      fs.writeFileSync(path.join(emptySubDir, 'readme.md'), 'not an index');

      const migrations = await loadMigrationsFromDirectory(migrationsDir);

      expect(migrations).toEqual([]);
    });

    it('should skip non-ts/js files', async () => {
      const migrationsDir = path.join(tmpDir, 'migrations');
      fs.mkdirSync(migrationsDir);
      fs.writeFileSync(path.join(migrationsDir, 'README.md'), '# Readme');
      fs.writeFileSync(path.join(migrationsDir, 'config.json'), '{}');

      const migrations = await loadMigrationsFromDirectory(migrationsDir);

      expect(migrations).toEqual([]);
    });

    it('should sort migrations by name', async () => {
      const migrationsDir = path.join(tmpDir, 'migrations');
      fs.mkdirSync(migrationsDir);

      fs.writeFileSync(
        path.join(migrationsDir, '002_second.js'),
        `module.exports = { default: { id: '002', name: 'Second', execute: async function() {} } };`,
      );
      fs.writeFileSync(
        path.join(migrationsDir, '001_first.js'),
        `module.exports = { default: { id: '001', name: 'First', execute: async function() {} } };`,
      );

      const migrations = await loadMigrationsFromDirectory(migrationsDir);

      expect(migrations).toHaveLength(2);
      expect(migrations[0].id).toBe('001');
      expect(migrations[1].id).toBe('002');
    });

    it('should warn and skip modules with invalid migration format', async () => {
      const migrationsDir = path.join(tmpDir, 'migrations');
      fs.mkdirSync(migrationsDir);

      fs.writeFileSync(
        path.join(migrationsDir, '001_invalid.js'),
        `module.exports = { default: { id: '001' } };`, // missing name and execute
      );

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation();
      const migrations = await loadMigrationsFromDirectory(migrationsDir);

      expect(migrations).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        'Invalid migration format in 001_invalid.js',
      );
    });

    it('should warn and skip modules without default export', async () => {
      const migrationsDir = path.join(tmpDir, 'migrations');
      fs.mkdirSync(migrationsDir);

      fs.writeFileSync(
        path.join(migrationsDir, '001_nodefault.js'),
        `module.exports = { somethingElse: 'not a migration' };`,
      );

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation();
      const migrations = await loadMigrationsFromDirectory(migrationsDir);

      expect(migrations).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(
        'No default export found in 001_nodefault.js',
      );
    });

    it('should log error and continue when a migration file fails to load', async () => {
      const migrationsDir = path.join(tmpDir, 'migrations');
      fs.mkdirSync(migrationsDir);

      fs.writeFileSync(
        path.join(migrationsDir, '001_broken.js'),
        `throw new Error('Syntax error');`,
      );

      const errorSpy = vi.spyOn(console, 'error').mockImplementation();
      const migrations = await loadMigrationsFromDirectory(migrationsDir);

      expect(migrations).toEqual([]);
      expect(errorSpy).toHaveBeenCalledWith(
        'Failed to load migration from 001_broken.js:',
        expect.any(Error),
      );
    });
  });
});
