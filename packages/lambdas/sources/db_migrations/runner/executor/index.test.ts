import * as executor from './index';
import * as tracker from '../../tracker';
import { Migration } from '../types';

jest.mock('../../tracker');

describe('Migration Executor Functions', () => {
  let mockMigration: Migration;

  beforeEach(() => {
    mockMigration = {
      id: '001',
      name: 'Test Migration',
      execute: jest.fn().mockResolvedValue(undefined),
    };

    jest.clearAllMocks();
  });

  describe('generateMigrationContent', () => {
    it('should generate migration content with stringified execute function', () => {
      const content = executor.generateMigrationContent(mockMigration);
      const parsed = JSON.parse(content);

      expect(parsed.id).toBe('001');
      expect(parsed.name).toBe('Test Migration');
      expect(typeof parsed.execute).toBe('string');
    });
  });

  describe('executeMigration', () => {
    it('should skip already executed migration', async () => {
      jest.mocked(tracker.isMigrationExecuted).mockResolvedValue(true);

      const result = await executor.executeMigration(mockMigration);

      expect(result.status).toBe('skipped');
      expect(result.id).toBe('001');
      expect(result.name).toBe('Test Migration');
    });

    it('should execute migration successfully', async () => {
      jest.mocked(tracker.isMigrationExecuted).mockResolvedValue(false);
      jest.mocked(tracker.validateMigrationChecksum).mockResolvedValue(true);

      const result = await executor.executeMigration(mockMigration);

      expect(result.status).toBe('success');
      expect(result.executedAt).toBeTruthy();
      expect(mockMigration.execute).toHaveBeenCalled();
      expect(tracker.recordMigration).toHaveBeenCalled();
      expect(tracker.updateLastExecutedMigration).toHaveBeenCalled();
    });

    it('should fail when checksum validation fails', async () => {
      jest.mocked(tracker.isMigrationExecuted).mockResolvedValue(false);
      jest.mocked(tracker.validateMigrationChecksum).mockResolvedValue(false);

      const result = await executor.executeMigration(mockMigration);

      expect(result.status).toBe('failed');
      expect(result.error).toContain('checksum validation failed');
      expect(mockMigration.execute).not.toHaveBeenCalled();
    });

    it('should handle migration execution errors', async () => {
      jest.mocked(tracker.isMigrationExecuted).mockResolvedValue(false);
      jest.mocked(tracker.validateMigrationChecksum).mockResolvedValue(true);
      (mockMigration.execute as jest.Mock).mockRejectedValue(new Error('Execution failed'));

      const result = await executor.executeMigration(mockMigration);

      expect(result.status).toBe('failed');
      expect(result.error).toBe('Execution failed');
    });
  });
});