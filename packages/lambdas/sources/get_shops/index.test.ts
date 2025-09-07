import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable, DynamoDBIndex } = DynamoDB;

import { handler } from "./index";
import { IShop } from "@kairos-lambdas-libs/dynamodb/types/shops";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    query: jest.fn(),
}));

describe('Given the get_shops lambda handler', () => {
    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should make a query request to the shops table with project ID', async () => {
        const querySpy = mockQuery();

        await handler(createMockEvent(), {} as any, {} as any);

        expect(querySpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.SHOPS,
            indexName: DynamoDBIndex.SHOPS_PROJECT,
            attributes: {
                projectId: "test-project",
            },
        });
    });

    it('should log the response', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

        await handler(createMockEvent(), {} as any, {} as any);

        expect(logSpy).toHaveBeenCalledWith('Retrieved 3 shops');
    });

    it('should return status 200 and a sorted list of shops', async () => {
        mockQuery();

        const result = await handler(createMockEvent(), {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toStrictEqual(JSON.stringify(EXAMPLE_DB_SHOPS_SORTED));
    });

    describe('When the query request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

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

const mockQuery = () => jest.spyOn(DynamoDB, 'query').mockResolvedValue(EXAMPLE_DB_SHOPS_SORTED);

const createMockEvent = (projectId: string = "test-project") => ({
    headers: {
        "X-Project-ID": projectId,
    },
} as any);

const EXAMPLE_DB_SHOPS: Array<IShop> = [
    {
        id: "shop-1",
        projectId: "test-project",
        name: "Grocery Store",
        icon: "/assets/icons/generic-grocery-item.png",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "shop-2",
        projectId: "test-project",
        name: "Chinese Market",
        icon: "/assets/icons/generic-grocery-item.png",
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
    },
    {
        id: "shop-3",
        projectId: "test-project",
        name: "Bike Store",
        icon: "/assets/icons/generic-grocery-item.png",
        createdAt: "2024-01-03T00:00:00Z",
        updatedAt: "2024-01-03T00:00:00Z",
    },
];

const EXAMPLE_DB_SHOPS_SORTED: Array<IShop> = [
    EXAMPLE_DB_SHOPS[2], // Bike Store
    EXAMPLE_DB_SHOPS[1], // Chinese Market  
    EXAMPLE_DB_SHOPS[0], // Grocery Store
];
