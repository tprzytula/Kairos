import { updateItem, putItem, query } from "@kairos-lambdas-libs/dynamodb";
import { DynamoDBTable, DynamoDBIndex } from "@kairos-lambdas-libs/dynamodb";
import { upsertItem } from ".";
import { IGroceryItem } from "../types";

jest.mock('@kairos-lambdas-libs/dynamodb', () => ({
    ...jest.requireActual('@kairos-lambdas-libs/dynamodb'),
    getItem: jest.fn(),
    putItem: jest.fn(),
    updateItem: jest.fn(),
    query: jest.fn(),
}));

describe('Given the upsertItem function', () => {
    beforeEach(() => {
        jest.mocked(query).mockResolvedValue([]);
    });

    it('should check if the item already exists', async () => {
        await upsertItem(EXAMPLE_GROCERY_ITEM);

        expect(jest.mocked(query)).toHaveBeenCalledWith({
            tableName: DynamoDBTable.GROCERY_LIST,
            indexName: DynamoDBIndex.GROCERY_LIST_PROJECT,
            attributes: {
                projectId: EXAMPLE_GROCERY_ITEM.projectId,
            },
        });
    });

    describe('When the item already exists', () => {
        it('should update the existing item', async () => {
            jest.mocked(query).mockResolvedValue([EXAMPLE_GROCERY_ITEM]);

            await upsertItem(EXAMPLE_GROCERY_ITEM);

            expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
                key: { id: "1" },
                tableName: DynamoDBTable.GROCERY_LIST,
                updatedFields: { quantity: 2 }
            });
        });

        it('should return the id of the updated item', async () => {
            jest.mocked(query).mockResolvedValue([EXAMPLE_GROCERY_ITEM]);
            const result = await upsertItem(EXAMPLE_GROCERY_ITEM);

            expect(result).toEqual({ id: EXAMPLE_GROCERY_ITEM.id, statusCode: 200 });
        });
    });

    describe('When the item does not exist', () => {
        it('should create a new item', async () => {
            jest.mocked(query).mockResolvedValue([]);

            await upsertItem(EXAMPLE_GROCERY_ITEM);

            expect(jest.mocked(putItem)).toHaveBeenCalledWith({
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

        it('should return the id of the new item', async () => {
            jest.mocked(query).mockResolvedValue([]);

            const result = await upsertItem(EXAMPLE_GROCERY_ITEM);

            expect(result).toEqual({ id: expect.any(String), statusCode: 201 });
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
