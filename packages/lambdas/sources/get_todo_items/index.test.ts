import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable, DynamoDBIndex } = DynamoDB;

import { handler } from "./index";
import { ITodoItem } from "@kairos-lambdas-libs/dynamodb/types/index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    query: jest.fn(),
}));

describe('Given the get_todo_items lambda handler', () => {
    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should make a query request to the todo list table with project ID', async () => {
        const querySpy = mockQuery();

        await handler(createMockEvent(), {} as any, {} as any);

        expect(querySpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.TODO_LIST,
            indexName: DynamoDBIndex.TODO_LIST_PROJECT,
            attributes: {
                projectId: "test-project",
            },
        });
    });

    it('should log the response', async () => {
        const logSpy = jest.spyOn(console, 'info').mockImplementation(() => { });

        await handler(createMockEvent(), {} as any, {} as any);

        expect(logSpy).toHaveBeenCalledWith('Returning items', {
            count: 2,
            items: JSON.stringify(EXAMPLE_DB_TODO_ITEMS),
        });
    });

    it('should return status 200 and a list of todo items', async () => {
        mockQuery();

        const result = await handler(createMockEvent(), {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify(EXAMPLE_DB_TODO_ITEMS));
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
                },
                statusCode: 500,
            });
        });
    });
});

const mockQuery = () => jest.spyOn(DynamoDB, 'query').mockResolvedValue(EXAMPLE_DB_TODO_ITEMS);

const createMockEvent = (projectId: string = "test-project") => ({
    headers: {
        "X-Project-ID": projectId,
    },
} as any);

const EXAMPLE_DB_TODO_ITEMS: Array<ITodoItem> = [
    {
        id: "1",
        projectId: "test-project",
        name: "Buy groceries",
        isDone: false,
    },
    {
        id: "2",
        projectId: "test-project",
        name: "Go to the gym",
        isDone: false,
    },
];
