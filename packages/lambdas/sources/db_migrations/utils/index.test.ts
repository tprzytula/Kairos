import * as utils from './index';
import * as tracker from '../tracker';
import { LastMigrationRecord, MigrationRecord } from '../tracker/types';

jest.mock('../tracker');

describe('Migration Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLastMigrationStatus', () => {
    it('should return status when no migrations have been executed', async () => {
      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(null);

      const result = await utils.getLastMigrationStatus();

      expect(result).toEqual({
        hasExecutedMigrations: false,
        message: 'No migrations have been executed yet',
      });
    });

    it('should return last migration status when migrations exist', async () => {
      const mockLastMigration: LastMigrationRecord = {
        id: 'LAST_MIGRATION',
        lastMigrationId: '003',
        lastMigrationName: 'Add user preferences',
        lastExecutedAt: '2024-01-15T10:30:00Z',
        totalExecuted: 3,
      };

      jest.mocked(tracker.getLastExecutedMigration).mockResolvedValue(mockLastMigration);

      const result = await utils.getLastMigrationStatus();

      expect(result).toEqual({
        hasExecutedMigrations: true,
        lastMigrationId: '003',
        lastMigrationName: 'Add user preferences',
        lastExecutedAt: '2024-01-15T10:30:00Z',
        totalExecuted: 3,
        message: 'Last migration: 003 (Add user preferences) executed at 2024-01-15T10:30:00Z',
      });
    });
  });

  describe('getAllExecutedMigrations', () => {
    it('should return all executed migrations', async () => {
      const mockMigrations: MigrationRecord[] = [
        {
          id: '001',
          name: 'Initial setup',
          executedAt: '2024-01-01T00:00:00Z',
          checksum: 'hash1',
        },
        {
          id: '002',
          name: 'Add categories',
          executedAt: '2024-01-02T00:00:00Z',
          checksum: 'hash2',
        },
        {
          id: '003',
          name: 'Add user preferences',
          executedAt: '2024-01-15T10:30:00Z',
          checksum: 'hash3',
        },
      ];

      jest.mocked(tracker.getExecutedMigrations).mockResolvedValue(mockMigrations);

      const result = await utils.getAllExecutedMigrations();

      expect(result).toEqual(mockMigrations);
      expect(tracker.getExecutedMigrations).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no migrations have been executed', async () => {
      jest.mocked(tracker.getExecutedMigrations).mockResolvedValue([]);

      const result = await utils.getAllExecutedMigrations();

      expect(result).toEqual([]);
    });
  });
});