import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable, DynamoDBIndex } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    query: vi.fn(),
}));

describe('Given the get_adventures lambda handler', () => {
    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should make a query request to the adventures table with project ID', async () => {
        const querySpy = mockQuery();

        await handler(createMockEvent(), {} as any, {} as any);

        expect(querySpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.ADVENTURES,
            indexName: DynamoDBIndex.ADVENTURES_PROJECT,
            attributes: {
                projectId: "test-project",
            },
        });
    });

    it('should return status 200 and a list of adventures', async () => {
        mockQuery();

        const result = await handler(createMockEvent(), {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toStrictEqual(JSON.stringify(EXAMPLE_ADVENTURES));
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

const mockQuery = () => vi.spyOn(DynamoDB, 'query').mockResolvedValue(EXAMPLE_ADVENTURES);

const createMockEvent = () => ({
    headers: {
        "X-Project-ID": "test-project",
    },
} as any);

const EXAMPLE_ADVENTURES = [
    {
        id: "1",
        projectId: "test-project",
        name: "Beach Trip",
        date: "2026-06-15",
    },
    {
        id: "2",
        projectId: "test-project",
        name: "Mountain Hike",
        date: "2026-07-20",
    },
];
