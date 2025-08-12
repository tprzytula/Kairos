import * as tracker from './index';
import { DynamoDBTable, getItem, putItem, scan } from '@kairos-lambdas-libs/dynamodb';
import { MigrationRecord, LastMigrationRecord } from './types';

jest.mock('@kairos-lambdas-libs/dynamodb', () => ({
  ...jest.requireActual('@kairos-lambdas-libs/dynamodb'),
  getItem: jest.fn(),
  putItem: jest.fn(),
  scan: jest.fn(),
}));

describe('Migration Tracker Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getExecutedMigrations', () => {
    it('should scan the migrations table and return migration records', async () => {
      const mockMigrations: MigrationRecord[] = [
        { id: '001', name: 'Test Migration 1', executedAt: '2024-01-01T00:00:00Z', checksum: 'hash1' },
        { id: '002', name: 'Test Migration 2', executedAt: '2024-01-02T00:00:00Z', checksum: 'hash2' },
      ];
      
      jest.mocked(scan).mockResolvedValue(mockMigrations);

      const result = await tracker.getExecutedMigrations();

      expect(scan).toHaveBeenCalledWith({
        tableName: DynamoDBTable.MIGRATIONS,
      });
      expect(result).toEqual(mockMigrations);
    });

    it('should return empty array when table does not exist', async () => {
      jest.mocked(scan).mockRejectedValue(new Error('Table not found'));
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await tracker.getExecutedMigrations();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Migrations table might not exist yet, returning empty array');
    });
  });

  describe('getMigration', () => {
    it('should get a specific migration by id', async () => {
      const mockMigration: MigrationRecord = {
        id: '001',
        name: 'Test Migration',
        executedAt: '2024-01-01T00:00:00Z',
        checksum: 'hash1',
      };

      jest.mocked(getItem).mockResolvedValue(mockMigration);

      const result = await tracker.getMigration('001');

      expect(getItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.MIGRATIONS,
        item: { id: '001' },
      });
      expect(result).toEqual(mockMigration);
    });

    it('should return null when migration is not found', async () => {
      jest.mocked(getItem).mockRejectedValue(new Error('Not found'));
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await tracker.getMigration('001');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Migration 001 not found or table doesn\'t exist');
    });
  });

  describe('recordMigration', () => {
    it('should record a migration with checksum', async () => {
      const mockDate = '2024-01-01T00:00:00.000Z';
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

      await tracker.recordMigration('001', 'Test Migration', 'migration content');

      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.MIGRATIONS,
        item: {
          id: '001',
          name: 'Test Migration',
          executedAt: mockDate,
          checksum: expect.any(String),
        },
      });
    });
  });

  describe('generateChecksum', () => {
    it('should generate consistent checksums for same content', () => {
      const content = 'test content';
      const checksum1 = tracker.generateChecksum(content);
      const checksum2 = tracker.generateChecksum(content);

      expect(checksum1).toBe(checksum2);
      expect(typeof checksum1).toBe('string');
      expect(checksum1.length).toBe(64); // SHA256 hex length
    });

    it('should generate different checksums for different content', () => {
      const checksum1 = tracker.generateChecksum('content1');
      const checksum2 = tracker.generateChecksum('content2');

      expect(checksum1).not.toBe(checksum2);
    });
  });

  describe('isMigrationExecuted', () => {
    it('should return true when migration exists', async () => {
      const mockMigration: MigrationRecord = {
        id: '001',
        name: 'Test Migration',
        executedAt: '2024-01-01T00:00:00Z',
        checksum: 'hash1',
      };

      jest.mocked(getItem).mockResolvedValue(mockMigration);

      const result = await tracker.isMigrationExecuted('001');

      expect(result).toBe(true);
    });

    it('should return false when migration does not exist', async () => {
      jest.mocked(getItem).mockResolvedValue(null);

      const result = await tracker.isMigrationExecuted('001');

      expect(result).toBe(false);
    });
  });

  describe('validateMigrationChecksum', () => {
    it('should return true when migration does not exist yet', async () => {
      jest.mocked(getItem).mockResolvedValue(null);

      const result = await tracker.validateMigrationChecksum('001', 'content');

      expect(result).toBe(true);
    });

    it('should return true when checksum matches', async () => {
      const content = 'test content';
      const checksum = tracker.generateChecksum(content);
      const mockMigration: MigrationRecord = {
        id: '001',
        name: 'Test Migration',
        executedAt: '2024-01-01T00:00:00Z',
        checksum,
      };

      jest.mocked(getItem).mockResolvedValue(mockMigration);

      const result = await tracker.validateMigrationChecksum('001', content);

      expect(result).toBe(true);
    });

    it('should return false when checksum does not match', async () => {
      const mockMigration: MigrationRecord = {
        id: '001',
        name: 'Test Migration',
        executedAt: '2024-01-01T00:00:00Z',
        checksum: 'different-hash',
      };

      jest.mocked(getItem).mockResolvedValue(mockMigration);

      const result = await tracker.validateMigrationChecksum('001', 'content');

      expect(result).toBe(false);
    });
  });

  describe('getLastExecutedMigration', () => {
    it('should get the last migration record', async () => {
      const mockLastMigration: LastMigrationRecord = {
        id: 'LAST_MIGRATION',
        lastMigrationId: '002',
        lastMigrationName: 'Latest Migration',
        lastExecutedAt: '2024-01-02T00:00:00Z',
        totalExecuted: 2,
      };

      jest.mocked(getItem).mockResolvedValue(mockLastMigration);

      const result = await tracker.getLastExecutedMigration();

      expect(getItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.MIGRATIONS,
        item: { id: 'LAST_MIGRATION' },
      });
      expect(result).toEqual(mockLastMigration);
    });

    it('should return null when last migration record does not exist', async () => {
      jest.mocked(getItem).mockRejectedValue(new Error('Not found'));
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await tracker.getLastExecutedMigration();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Last migration record not found');
    });
  });

  describe('updateLastExecutedMigration', () => {
    it('should update the last migration record', async () => {
      const mockExecutedMigrations = [
        { id: '001', name: 'Migration 1', executedAt: '2024-01-01T00:00:00Z', checksum: 'hash1' },
        { id: '002', name: 'Migration 2', executedAt: '2024-01-02T00:00:00Z', checksum: 'hash2' },
      ];
      const mockDate = '2024-01-02T12:00:00.000Z';

      jest.mocked(scan).mockResolvedValue(mockExecutedMigrations);
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate);

      await tracker.updateLastExecutedMigration('002', 'Migration 2');

      expect(putItem).toHaveBeenCalledWith({
        tableName: DynamoDBTable.MIGRATIONS,
        item: {
          id: 'LAST_MIGRATION',
          lastMigrationId: '002',
          lastMigrationName: 'Migration 2',
          lastExecutedAt: mockDate,
          totalExecuted: 2,
        },
      });
    });
  });
});