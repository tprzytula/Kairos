import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable, DynamoDBIndex } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    query: vi.fn(),
}));

describe('Given the get_office_attendance lambda handler', () => {
    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should make a query request to the office attendance table with project ID', async () => {
        const querySpy = mockQuery();

        await handler(createMockEvent(), {} as any, {} as any);

        expect(querySpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.OFFICE_ATTENDANCE,
            indexName: DynamoDBIndex.OFFICE_ATTENDANCE_PROJECT,
            attributes: {
                projectId: "test-project",
            },
        });
    });

    it('should return status 200 and a list of office attendance entries', async () => {
        mockQuery();

        const result = await handler(createMockEvent(), {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toStrictEqual(JSON.stringify(EXAMPLE_ATTENDANCE));
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

const mockQuery = () => vi.spyOn(DynamoDB, 'query').mockResolvedValue(EXAMPLE_ATTENDANCE);

const createMockEvent = () => ({
    headers: {
        "X-Project-ID": "test-project",
    },
} as any);

const EXAMPLE_ATTENDANCE = [
    {
        id: "1",
        projectId: "test-project",
        date: "2026-04-07",
        userId: "user-1",
        userName: "John Doe",
    },
    {
        id: "2",
        projectId: "test-project",
        date: "2026-04-07",
        userId: "user-2",
        userName: "Jane Smith",
    },
];
