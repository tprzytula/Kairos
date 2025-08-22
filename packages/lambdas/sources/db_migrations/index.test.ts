import { handler } from './index';
import * as runner from './runner';
import * as tracker from './tracker';
import { Migration, MigrationResult } from './runner/types';
import { LastMigrationRecord } from './tracker/types';

jest.mock('./runner');
jest.mock('./tracker');

jest.mock('./migrations/001_add_grocery_defaults', () => ({
  default: { id: '001', name: 'Migration 1', execute: jest.fn() }
}));

describe('db_migrations lambda handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const runHandler = (event: any = {}) => 
    handler(event, {} as any, {} as any);

  describe('when no migrations to run', () => {
    it('should return success when all migrations are skipped', async () => {
      const mockResults: MigrationResult[] = [
        { id: '001', name: 'Migration 1', status: 'skipped' },
      ];
      
      jest.mocked(runner.runMigrations).mockResolvedValue(mockResults);
      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(null);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await runHandler();

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body)).toEqual({
        success: true,
        message: 'Migrations completed. Success: 0, Skipped: 1, Failed: 0',
        results: mockResults,
        lastMigration: null,
        summary: {
          total: 1,
          success: 0,
          skipped: 1,
          failed: 0,
        },
      });
      expect(consoleSpy).toHaveBeenCalledWith('Loaded 3 embedded migrations');
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
      jest.mocked(runner.runMigrations).mockResolvedValue(mockResults);
      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(mockLastMigration);

      const result = await runHandler();

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
      
      jest.mocked(runner.runMigrations).mockResolvedValue(mockResults);
      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(mockLastMigration);

      await runHandler();

      expect(consoleSpy).toHaveBeenCalledWith('Starting database migrations...');
      expect(consoleSpy).toHaveBeenCalledWith('Loaded 3 embedded migrations');
      expect(consoleSpy).toHaveBeenCalledWith('Migration run summary:', {
        total: 2,
        success: 2,
        skipped: 0,
        failed: 0,
      });
    });
  });

  describe('when migration execution fails', () => {
    it('should handle errors gracefully', async () => {
      const error = new Error('Migration execution failed');
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
      const mockResults: MigrationResult[] = [
        { id: '001', name: 'Migration 1', status: 'success', executedAt: '2024-01-01T00:00:00Z' },
      ];

      jest.mocked(runner.runMigrations).mockResolvedValue(mockResults);
      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(null);

      const result = await runHandler();

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.lastMigration).toBeNull();
    });
  });
});