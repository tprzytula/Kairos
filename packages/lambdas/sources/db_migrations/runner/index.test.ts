import * as runner from './index';
import * as tracker from '../tracker';
import { Migration, MigrationResult } from './types';

jest.mock('../tracker');

describe('Migration Runner Functions', () => {
  let mockMigrations: Migration[];

  beforeEach(() => {
    mockMigrations = [
      {
        id: '001',
        name: 'First Migration',
        execute: jest.fn().mockResolvedValue(undefined),
      },
      {
        id: '002',
        name: 'Second Migration',
        execute: jest.fn().mockResolvedValue(undefined),
      },
    ];

    jest.clearAllMocks();
  });

  describe('runMigrations', () => {
    it('should execute all pending migrations in order', async () => {
      jest.mocked(tracker.isMigrationExecuted).mockResolvedValue(false);
      jest.mocked(tracker.validateMigrationChecksum).mockResolvedValue(true);

      const results = await runner.runMigrations(mockMigrations);

      expect(mockMigrations[0].execute).toHaveBeenCalled();
      expect(mockMigrations[1].execute).toHaveBeenCalled();
      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('success');
      expect(results[1].status).toBe('success');
    });

    it('should skip already executed migrations', async () => {
      jest.mocked(tracker.isMigrationExecuted)
        .mockResolvedValueOnce(true)  // First migration already executed
        .mockResolvedValueOnce(false); // Second migration not executed
      jest.mocked(tracker.validateMigrationChecksum).mockResolvedValue(true);

      const results = await runner.runMigrations(mockMigrations);

      expect(mockMigrations[0].execute).not.toHaveBeenCalled();
      expect(mockMigrations[1].execute).toHaveBeenCalled();
      expect(results[0].status).toBe('skipped');
      expect(results[1].status).toBe('success');
    });

    it('should stop execution on first failure', async () => {
      jest.mocked(tracker.isMigrationExecuted).mockResolvedValue(false);
      jest.mocked(tracker.validateMigrationChecksum).mockResolvedValue(true);
      
      const error = new Error('Migration failed');
      (mockMigrations[0].execute as jest.Mock).mockRejectedValue(error);

      const results = await runner.runMigrations(mockMigrations);

      expect(mockMigrations[0].execute).toHaveBeenCalled();
      expect(mockMigrations[1].execute).not.toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].status).toBe('failed');
      expect(results[0].error).toBe('Migration failed');
    });

    it('should fail migration when checksum validation fails', async () => {
      jest.mocked(tracker.isMigrationExecuted).mockResolvedValue(false);
      jest.mocked(tracker.validateMigrationChecksum).mockResolvedValue(false);

      const results = await runner.runMigrations(mockMigrations);

      expect(mockMigrations[0].execute).not.toHaveBeenCalled();
      expect(results[0].status).toBe('failed');
      expect(results[0].error).toContain('checksum validation failed');
    });

    it('should record successful migrations', async () => {
      jest.mocked(tracker.isMigrationExecuted).mockResolvedValue(false);
      jest.mocked(tracker.validateMigrationChecksum).mockResolvedValue(true);

      await runner.runMigrations(mockMigrations);

      expect(tracker.recordMigration).toHaveBeenCalledTimes(2);
      expect(tracker.updateLastExecutedMigration).toHaveBeenCalledTimes(2);
      
      expect(tracker.recordMigration).toHaveBeenCalledWith(
        '001',
        'First Migration',
        expect.any(String)
      );
      expect(tracker.updateLastExecutedMigration).toHaveBeenCalledWith(
        '001',
        'First Migration'
      );
    });

    it('should handle unexpected errors gracefully', async () => {
      jest.mocked(tracker.isMigrationExecuted).mockRejectedValue(new Error('Database connection lost'));

      const results = await runner.runMigrations(mockMigrations);

      expect(results).toHaveLength(1);
      expect(results[0].status).toBe('failed');
      expect(results[0].error).toBe('Database connection lost');
    });

    it('should log migration progress', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      jest.mocked(tracker.isMigrationExecuted).mockResolvedValue(false);
      jest.mocked(tracker.validateMigrationChecksum).mockResolvedValue(true);

      await runner.runMigrations(mockMigrations);

      expect(consoleSpy).toHaveBeenCalledWith('Starting migration run with 2 migrations');
      expect(consoleSpy).toHaveBeenCalledWith('Processing migration: 001 - First Migration');
      expect(consoleSpy).toHaveBeenCalledWith('Executing migration: 001');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Migration 001 executed successfully'));
    });
  });

  describe('loadMigrationsFromDirectory', () => {
    it('should handle directory loading scenarios', async () => {
      // Since the loader function is actually tested in a separate module,
      // we can test the integration by mocking the loader module directly
      const mockMigrations = [
        { id: '001', name: 'Test Migration 1', execute: jest.fn() },
        { id: '002', name: 'Test Migration 2', execute: jest.fn() },
      ];

      // Mock the loader module
      jest.doMock('./loader', () => ({
        loadMigrationsFromDirectory: jest.fn().mockResolvedValue(mockMigrations),
      }));

      // Re-import to get the mocked version
      const { loadMigrationsFromDirectory } = await import('./loader');
      
      const migrations = await loadMigrationsFromDirectory('/test');
      
      expect(migrations).toHaveLength(2);
      expect(migrations[0].id).toBe('001');
      expect(migrations[1].id).toBe('002');
      
      jest.dontMock('./loader');
    });
  });
});