import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable, DynamoDBIndex } = DynamoDB;

import { handler } from "./index";
import { IGroceryItem } from "@kairos-lambdas-libs/dynamodb/types/groceryList";
import { GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb/enums";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    query: vi.fn(),
}));

describe('Given the get_grocery_items lambda handler', () => {
    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should make a query request to the grocery list table with project ID', async () => {
        const querySpy = mockQuery();

        await handler(createMockEvent(), {} as any, {} as any);

        expect(querySpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.GROCERY_LIST,
            indexName: DynamoDBIndex.GROCERY_LIST_PROJECT,
            attributes: {
                projectId: "test-project",
            },
        });
    });

    it('should log the response', async () => {
        const logSpy = vi.spyOn(console, 'info').mockImplementation(() => { });

        await handler(createMockEvent(), {} as any, {} as any);

        expect(logSpy).toHaveBeenCalledWith('Returning items', {
            count: 3,
            items: JSON.stringify(SORTED_GROCERY_ITEMS),
        });
    });

    it('should return status 200 and a list of grocery items sorted alphabetically', async () => {
        mockQuery();

        const result = await handler(createMockEvent(), {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toStrictEqual(JSON.stringify(SORTED_GROCERY_ITEMS));
    });

    describe('When shopId query parameter is provided', () => {
        it('should filter items by shopId', async () => {
            const itemsWithShops = [
                ...EXAMPLE_DB_GROCERY_ITEMS,
                {
                    id: "4",
                    projectId: "test-project",
                    name: "Cherry",
                    quantity: "1",
                    imagePath: "Image 4",
                    unit: GroceryItemUnit.KILOGRAM,
                    shopId: "shop-1",
                },
            ];

            vi.spyOn(DynamoDB, 'query').mockResolvedValue(itemsWithShops);

            const event = {
                headers: { "X-Project-ID": "test-project" },
                queryStringParameters: { shopId: "shop-1" },
            } as any;

            const result = await handler(event, {} as any, {} as any);

            expect(result.statusCode).toBe(200);
            const body = JSON.parse(result.body);
            expect(body).toHaveLength(1);
            expect(body[0].shopId).toBe("shop-1");
        });
    });

    describe('When the query request fails', () => {
        it('should log the error', async () => {
            const logSpy = vi.spyOn(console, 'error');

            const querySpy = mockQuery();
            querySpy.mockRejectedValue(new Error('Query failed'));

            await handler(createMockEvent(), {} as any, {} as any);

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Query failed'));
        });

        it('should return status 500', async () => {
            const querySpy = mockQuery();
            querySpy.mockRejectedValue(new Error('Query failed'));

            const result = await handler(createMockEvent(), {} as any, {} as any);

            expect(result).toEqual({
                body: "Internal Server Error",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },
                statusCode: 500,
            });
        });
    });
});

const mockQuery = () => vi.spyOn(DynamoDB, 'query').mockResolvedValue(EXAMPLE_DB_GROCERY_ITEMS);

// Sorted alphabetically by name: Apple, Avocado, Banana
const SORTED_GROCERY_ITEMS: Array<IGroceryItem> = [
    {
        id: "3",
        projectId: "test-project",
        name: "Apple",
        quantity: "2",
        imagePath: "Image 3",
        unit: GroceryItemUnit.KILOGRAM,
    },
    {
        id: "1",
        projectId: "test-project",
        name: "Avocado",
        quantity: "2",
        imagePath: "Image 1",
        unit: GroceryItemUnit.KILOGRAM,
    },
    {
        id: "2",
        projectId: "test-project",
        name: "Banana",
        quantity: "1",
        imagePath: "Image 2",
        unit: GroceryItemUnit.KILOGRAM,
    },
];

const createMockEvent = (projectId: string = "test-project") => ({
    headers: {
        "X-Project-ID": projectId,
    },
} as any);

const EXAMPLE_DB_GROCERY_ITEMS: Array<IGroceryItem> = [
    {
        id: "1",
        projectId: "test-project",
        name: "Avocado",
        quantity: "2",
        imagePath: "Image 1",
        unit: GroceryItemUnit.KILOGRAM,
    },
    {
        id: "2",
        projectId: "test-project",
        name: "Banana",
        quantity: "1",
        imagePath: "Image 2",
        unit: GroceryItemUnit.KILOGRAM,
    },
    {
        id: "3",
        projectId: "test-project",
        name: "Apple",
        quantity: "2",
        imagePath: "Image 3",
        unit: GroceryItemUnit.KILOGRAM,
    },
];
