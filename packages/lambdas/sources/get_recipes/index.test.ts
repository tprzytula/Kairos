import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable, DynamoDBIndex } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    query: vi.fn(),
}));

describe('Given the get_recipes lambda handler', () => {
    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should make a query request to the recipes table with project ID', async () => {
        const querySpy = mockQuery();

        await handler(createMockEvent(), {} as any, {} as any);

        expect(querySpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            indexName: DynamoDBIndex.RECIPES_PROJECT,
            attributes: {
                projectId: "test-project",
            },
        });
    });

    it('should return status 200 and parse JSON fields', async () => {
        mockQuery();

        const result = await handler(createMockEvent(), {} as any, {} as any);

        expect(result.statusCode).toBe(200);

        const parsed = JSON.parse(result.body);
        expect(parsed).toEqual([
            {
                id: "1",
                projectId: "test-project",
                name: "Pasta Carbonara",
                ingredients: [{ name: "Pasta", quantity: 500, unit: "g" }],
                instructions: ["Boil pasta", "Mix eggs"],
                mealTypes: ["dinner"],
                dishTypes: ["main"],
            },
        ]);
    });

    it('should handle items without ingredients field by defaulting to empty array', async () => {
        vi.spyOn(DynamoDB, 'query').mockResolvedValue([
            {
                id: "3",
                projectId: "test-project",
                name: "Quick Toast",
            },
        ]);

        const result = await handler(createMockEvent(), {} as any, {} as any);
        const parsed = JSON.parse(result.body);

        expect(parsed[0].ingredients).toEqual([]);
    });

    it('should handle missing optional JSON fields', async () => {
        vi.spyOn(DynamoDB, 'query').mockResolvedValue([
            {
                id: "2",
                projectId: "test-project",
                name: "Simple Salad",
                ingredients: JSON.stringify([{ name: "Lettuce", quantity: 1, unit: "piece" }]),
            },
        ]);

        const result = await handler(createMockEvent(), {} as any, {} as any);
        const parsed = JSON.parse(result.body);

        expect(parsed).toEqual([
            {
                id: "2",
                projectId: "test-project",
                name: "Simple Salad",
                ingredients: [{ name: "Lettuce", quantity: 1, unit: "piece" }],
                instructions: undefined,
                mealTypes: undefined,
                dishTypes: undefined,
            },
        ]);
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

const mockQuery = () => vi.spyOn(DynamoDB, 'query').mockResolvedValue(EXAMPLE_DB_RECIPES);

const createMockEvent = () => ({
    headers: {
        "X-Project-ID": "test-project",
    },
} as any);

const EXAMPLE_DB_RECIPES = [
    {
        id: "1",
        projectId: "test-project",
        name: "Pasta Carbonara",
        ingredients: JSON.stringify([{ name: "Pasta", quantity: 500, unit: "g" }]),
        instructions: JSON.stringify(["Boil pasta", "Mix eggs"]),
        mealTypes: JSON.stringify(["dinner"]),
        dishTypes: JSON.stringify(["main"]),
    },
];
