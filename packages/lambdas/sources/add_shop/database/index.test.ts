import { putItem, query } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb";
import { upsertItem } from ".";
import { randomUUID } from "node:crypto";

vi.mock('@kairos-lambdas-libs/dynamodb', async () => ({
    ...(await vi.importActual('@kairos-lambdas-libs/dynamodb')),
    putItem: vi.fn(),
    query: vi.fn(),
}));

vi.mock('node:crypto', async () => ({
    randomUUID: vi.fn().mockReturnValue('test-uuid'),
}));

describe('Given the upsertItem function for add_shop database', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('When a shop with the same name already exists', () => {
        it('should return the existing shop id with status 409', async () => {
            vi.mocked(query).mockResolvedValue([
                { id: 'existing-id', projectId: 'project-1', name: 'My Shop', icon: '/icon.png', createdAt: '2026-01-01', updatedAt: '2026-01-01' }
            ]);

            const result = await upsertItem({ projectId: 'project-1', name: 'my shop' });

            expect(result).toEqual({ id: 'existing-id', statusCode: 409 });
        });

        it('should query the shops table with the project ID', async () => {
            vi.mocked(query).mockResolvedValue([
                { id: 'existing-id', projectId: 'project-1', name: 'My Shop', icon: '/icon.png', createdAt: '2026-01-01', updatedAt: '2026-01-01' }
            ]);

            await upsertItem({ projectId: 'project-1', name: 'My Shop' });

            expect(vi.mocked(query)).toHaveBeenCalledWith({
                tableName: DynamoDBTable.SHOPS,
                indexName: DynamoDBIndex.SHOPS_PROJECT,
                attributes: { projectId: 'project-1' },
            });
        });
    });

    describe('When no shop with the same name exists', () => {
        it('should create a new shop and return the id with status 201', async () => {
            vi.mocked(query).mockResolvedValue([]);

            const result = await upsertItem({ projectId: 'project-1', name: 'New Shop' });

            expect(result).toEqual({ id: 'test-uuid', statusCode: 201 });
        });

        it('should call putItem with trimmed name and default icon', async () => {
            vi.mocked(query).mockResolvedValue([]);

            await upsertItem({ projectId: 'project-1', name: '  New Shop  ' });

            expect(vi.mocked(putItem)).toHaveBeenCalledWith({
                tableName: DynamoDBTable.SHOPS,
                item: expect.objectContaining({
                    id: 'test-uuid',
                    projectId: 'project-1',
                    name: 'New Shop',
                    icon: '/assets/icons/generic-grocery-item.png',
                }),
            });
        });

        it('should use the provided icon when given', async () => {
            vi.mocked(query).mockResolvedValue([]);

            await upsertItem({ projectId: 'project-1', name: 'New Shop', icon: '/custom-icon.png' });

            expect(vi.mocked(putItem)).toHaveBeenCalledWith({
                tableName: DynamoDBTable.SHOPS,
                item: expect.objectContaining({
                    icon: '/custom-icon.png',
                }),
            });
        });

        it('should set visibility to private when isPrivate is true', async () => {
            vi.mocked(query).mockResolvedValue([]);

            await upsertItem({ projectId: 'project-1', name: 'New Shop', isPrivate: true, userId: 'user-1' });

            expect(vi.mocked(putItem)).toHaveBeenCalledWith({
                tableName: DynamoDBTable.SHOPS,
                item: expect.objectContaining({
                    visibility: 'private',
                    ownerId: 'user-1',
                }),
            });
        });
    });
});
