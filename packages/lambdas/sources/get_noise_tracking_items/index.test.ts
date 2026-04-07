import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable, DynamoDBIndex } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    query: vi.fn(),
}));

describe('Given the get_noise_tracking_items lambda handler', () => {
    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should make a query request to the noise tracking table with project ID', async () => {
        const querySpy = mockQuery();

        await handler(createMockEvent(), {} as any, {} as any);

        expect(querySpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.NOISE_TRACKING,
            indexName: DynamoDBIndex.NOISE_TRACKING_PROJECT,
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
            items: JSON.stringify(SORTED_NOISE_TRACKING_ITEMS),
        });
    });

    it('should return status 200 and a list of noise tracking items sorted by timestamp descending', async () => {
        mockQuery();

        const result = await handler(createMockEvent(), {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify(SORTED_NOISE_TRACKING_ITEMS));
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
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },
                statusCode: 500,
            });
        });
    });
});

const mockQuery = () => vi.spyOn(DynamoDB, 'query').mockResolvedValue(EXAMPLE_DB_NOISE_TRACKING_ITEMS);

// Sorted descending by timestamp
const SORTED_NOISE_TRACKING_ITEMS: Record<string, unknown>[] = [
    {
        projectId: "test-project",
        timestamp: 1814003200000,
    },
    {
        projectId: "test-project",
        timestamp: 1714003200000,
    },
    {
        projectId: "test-project",
        timestamp: 1614003200000,
    },
];

const createMockEvent = (projectId: string = "test-project") => ({
    headers: {
        "X-Project-ID": projectId,
    },
} as any);

const EXAMPLE_DB_NOISE_TRACKING_ITEMS: Record<string, unknown>[] = [
    {
        projectId: "test-project",
        timestamp: 1714003200000,
    },
    {
        projectId: "test-project",
        timestamp: 1814003200000,
    },
    {
        projectId: "test-project",
        timestamp: 1614003200000,
    },
];
