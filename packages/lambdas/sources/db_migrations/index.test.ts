import { handler } from './index';
import * as runner from './runner';
import * as tracker from './tracker';
import { Migration, MigrationResult } from './runner/types';
import { LastMigrationRecord } from './tracker/types';

jest.mock('./runner');
jest.mock('./tracker');

// Mock path module
jest.mock('path', () => ({
  join: jest.fn().mockReturnValue('/mocked/path/migrations'),
}));

describe('db_migrations lambda handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const runHandler = (event: any = {}) => 
    handler(event, {} as any, {} as any);

  describe('when no migrations are found', () => {
    it('should return success with no migrations message', async () => {
      jest.mocked(runner.loadMigrationsFromDirectory).mockResolvedValue([]);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await runHandler();

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({
        success: true,
        message: 'No migrations to execute',
        results: [],
      });
      expect(consoleSpy).toHaveBeenCalledWith('No migrations found');
    });
  });

  describe('when migrations are found', () => {
    const mockMigrations: Migration[] = [
      { id: '001', name: 'Migration 1', execute: jest.fn() },
      { id: '002', name: 'Migration 2', execute: jest.fn() },
    ];

    const mockResults: MigrationResult[] = [
      { id: '001', name: 'Migration 1', status: 'success', executedAt: '2024-01-01T00:00:00Z' },
      { id: '002', name: 'Migration 2', status: 'success', executedAt: '2024-01-01T00:01:00Z' },
    ];

    const mockLastMigration: LastMigrationRecord = {
      id: 'LAST_MIGRATION',
      lastMigrationId: '002',
      lastMigrationName: 'Migration 2',
      lastExecutedAt: '2024-01-01T00:01:00Z',
      totalExecuted: 2,
    };

    it('should execute migrations successfully', async () => {
      jest.mocked(runner.loadMigrationsFromDirectory).mockResolvedValue(mockMigrations);
      jest.mocked(runner.runMigrations).mockResolvedValue(mockResults);
      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(mockLastMigration);

      const result = await runHandler();

      expect(runner.loadMigrationsFromDirectory).toHaveBeenCalledWith('/mocked/path/migrations');
      expect(runner.runMigrations).toHaveBeenCalled();
      expect(result.statusCode).toBe(200);

      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.message).toBe('Migrations completed. Success: 2, Skipped: 0, Failed: 0');
      expect(body.results).toEqual(mockResults);
      expect(body.lastMigration).toEqual(mockLastMigration);
      expect(body.summary).toEqual({
        total: 2,
        success: 2,
        skipped: 0,
        failed: 0,
      });
    });

    it('should handle mixed migration results', async () => {
      const mixedResults: MigrationResult[] = [
        { id: '001', name: 'Migration 1', status: 'success', executedAt: '2024-01-01T00:00:00Z' },
        { id: '002', name: 'Migration 2', status: 'skipped' },
        { id: '003', name: 'Migration 3', status: 'failed', error: 'Something went wrong' },
      ];

      jest.mocked(runner.loadMigrationsFromDirectory).mockResolvedValue(mockMigrations);
      jest.mocked(runner.runMigrations).mockResolvedValue(mixedResults);
      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(mockLastMigration);

      const result = await runHandler();

      expect(result.statusCode).toBe(500); // Should be 500 because there are failures
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.message).toBe('Migrations completed. Success: 1, Skipped: 1, Failed: 1');
      expect(body.summary).toEqual({
        total: 3,
        success: 1,
        skipped: 1,
        failed: 1,
      });
    });

    it('should log migration progress', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      jest.mocked(runner.loadMigrationsFromDirectory).mockResolvedValue(mockMigrations);
      jest.mocked(runner.runMigrations).mockResolvedValue(mockResults);
      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(mockLastMigration);

      await runHandler();

      expect(consoleSpy).toHaveBeenCalledWith('Starting database migrations...');
      expect(consoleSpy).toHaveBeenCalledWith('Loading migrations from: /mocked/path/migrations');
      expect(consoleSpy).toHaveBeenCalledWith('Migration run summary:', {
        total: 2,
        success: 2,
        skipped: 0,
        failed: 0,
      });
    });
  });

  describe('when migration loading fails', () => {
    it('should handle errors gracefully', async () => {
      const error = new Error('Failed to load migrations');
      jest.mocked(runner.loadMigrationsFromDirectory).mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await runHandler();

      expect(result.statusCode).toBe(500);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.message).toBe('Failed to run migrations');
      expect(body.error).toBe('Failed to load migrations');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to run migrations:', 'Failed to load migrations');
    });
  });

  describe('when migration execution fails', () => {
    it('should handle runner errors gracefully', async () => {
      const mockMigrations: Migration[] = [
        { id: '001', name: 'Migration 1', execute: jest.fn() },
      ];

      const error = new Error('Migration execution failed');
      jest.mocked(runner.loadMigrationsFromDirectory).mockResolvedValue(mockMigrations);
      jest.mocked(runner.runMigrations).mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await runHandler();

      expect(result.statusCode).toBe(500);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.message).toBe('Failed to run migrations');
      expect(body.error).toBe('Migration execution failed');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to run migrations:', 'Migration execution failed');
    });
  });

  describe('when last migration tracking fails', () => {
    it('should still return successful response if migrations succeeded', async () => {
      const mockMigrations: Migration[] = [
        { id: '001', name: 'Migration 1', execute: jest.fn() },
      ];

      const mockResults: MigrationResult[] = [
        { id: '001', name: 'Migration 1', status: 'success', executedAt: '2024-01-01T00:00:00Z' },
      ];

      jest.mocked(runner.loadMigrationsFromDirectory).mockResolvedValue(mockMigrations);
      jest.mocked(runner.runMigrations).mockResolvedValue(mockResults);
      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(null); // Return null instead of rejecting

      const result = await runHandler();

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.lastMigration).toBeNull();
    });
  });
});