import { updateItem, putItem, query } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb";
import { upsertItem, queryProjectItems } from ".";
import { IGroceryItem } from "@kairos-lambdas-libs/dynamodb/types/index";

vi.mock('@kairos-lambdas-libs/dynamodb', async () => ({
    ...(await vi.importActual('@kairos-lambdas-libs/dynamodb')),
    getItem: vi.fn(),
    putItem: vi.fn(),
    updateItem: vi.fn(),
    query: vi.fn(),
}));

describe('Given the queryProjectItems function', () => {
    it('should query the grocery list by project ID', async () => {
        vi.mocked(query).mockResolvedValue([]);

        await queryProjectItems('test-project');

        expect(vi.mocked(query)).toHaveBeenCalledWith({
            tableName: DynamoDBTable.GROCERY_LIST,
            indexName: DynamoDBIndex.GROCERY_LIST_PROJECT,
            attributes: { projectId: 'test-project' },
        });
    });
});

describe('Given the upsertItem function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should update the existing item when a match is found in projectItems', async () => {
        const projectItems = [{ ...EXAMPLE_GROCERY_ITEM }];

        await upsertItem(EXAMPLE_GROCERY_ITEM, projectItems);

        expect(vi.mocked(updateItem)).toHaveBeenCalledWith({
            key: { id: "1" },
            tableName: DynamoDBTable.GROCERY_LIST,
            updatedFields: { quantity: 2 }
        });
    });

    it('should return the id of the updated item', async () => {
        const projectItems = [{ ...EXAMPLE_GROCERY_ITEM }];

        const result = await upsertItem(EXAMPLE_GROCERY_ITEM, projectItems);

        expect(result).toEqual({ id: EXAMPLE_GROCERY_ITEM.id, statusCode: 200 });
    });

    it('should update in-memory item quantity after update', async () => {
        const projectItems = [{ ...EXAMPLE_GROCERY_ITEM }];

        await upsertItem(EXAMPLE_GROCERY_ITEM, projectItems);

        expect(projectItems[0].quantity).toBe(2);
    });

    it('should create a new item when no match is found', async () => {
        const projectItems: IGroceryItem[] = [];

        await upsertItem(EXAMPLE_GROCERY_ITEM, projectItems);

        expect(vi.mocked(putItem)).toHaveBeenCalledWith({
            tableName: DynamoDBTable.GROCERY_LIST,
            item: expect.objectContaining({
                projectId: EXAMPLE_GROCERY_ITEM.projectId,
                name: EXAMPLE_GROCERY_ITEM.name,
                quantity: EXAMPLE_GROCERY_ITEM.quantity,
                unit: EXAMPLE_GROCERY_ITEM.unit,
                imagePath: EXAMPLE_GROCERY_ITEM.imagePath,
            })
        });
    });

    it('should return the id of the new item with status 201', async () => {
        const projectItems: IGroceryItem[] = [];

        const result = await upsertItem(EXAMPLE_GROCERY_ITEM, projectItems);

        expect(result).toEqual({ id: expect.any(String), statusCode: 201 });
    });

    it('should add newly created item to the in-memory list', async () => {
        const projectItems: IGroceryItem[] = [];

        await upsertItem(EXAMPLE_GROCERY_ITEM, projectItems);

        expect(projectItems).toHaveLength(1);
        expect(projectItems[0].name).toBe(EXAMPLE_GROCERY_ITEM.name);
    });

    it('should not query the database directly', async () => {
        const projectItems: IGroceryItem[] = [];

        await upsertItem(EXAMPLE_GROCERY_ITEM, projectItems);

        expect(vi.mocked(query)).not.toHaveBeenCalled();
    });

    describe('When updating an existing item that has no category', () => {
        it('should add category to the update fields when new item has a category', async () => {
            const projectItems = [{ ...EXAMPLE_GROCERY_ITEM, category: undefined }] as IGroceryItem[];
            const itemWithCategory = { ...EXAMPLE_GROCERY_ITEM, category: 'Produce' } as IGroceryItem;

            await upsertItem(itemWithCategory, projectItems);

            expect(vi.mocked(updateItem)).toHaveBeenCalledWith({
                key: { id: '1' },
                tableName: DynamoDBTable.GROCERY_LIST,
                updatedFields: { quantity: 2, category: 'Produce' },
            });
        });

        it('should update the in-memory category when category is added', async () => {
            const projectItems = [{ ...EXAMPLE_GROCERY_ITEM, category: undefined }] as IGroceryItem[];
            const itemWithCategory = { ...EXAMPLE_GROCERY_ITEM, category: 'Produce' } as IGroceryItem;

            await upsertItem(itemWithCategory, projectItems);

            expect(projectItems[0].category).toBe('Produce');
        });
    });

    describe('When updating an existing item that already has a category', () => {
        it('should not overwrite the existing category', async () => {
            const projectItems = [{ ...EXAMPLE_GROCERY_ITEM, category: 'Existing' }] as IGroceryItem[];
            const itemWithCategory = { ...EXAMPLE_GROCERY_ITEM, category: 'New' } as IGroceryItem;

            await upsertItem(itemWithCategory, projectItems);

            expect(vi.mocked(updateItem)).toHaveBeenCalledWith({
                key: { id: '1' },
                tableName: DynamoDBTable.GROCERY_LIST,
                updatedFields: { quantity: 2 },
            });
        });
    });
});

const EXAMPLE_GROCERY_ITEM: IGroceryItem = {
    id: '1',
    projectId: 'test-project',
    shopId: 'shop-1',
    name: 'Example Item',
    quantity: 1,
    unit: 'kg',
    imagePath: 'https://example.com/image.jpg',
};
