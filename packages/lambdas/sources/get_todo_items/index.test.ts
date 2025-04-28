import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";
import { ITodoItem } from "@kairos-lambdas-libs/dynamodb/types/index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    scan: jest.fn(),
}));

describe('Given the get_todo_items lambda handler', () => {
    it('should make a scan request to the todo list table', async () => {
        const scanSpy = mockScan();

        await handler({} as any, {} as any, {} as any);

        expect(scanSpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.TODO_LIST,
        });
    });

    it('should log the response', async () => {
        const logSpy = jest.spyOn(console, 'info').mockImplementation(() => { });

        await handler({} as any, {} as any, {} as any);

        expect(logSpy).toHaveBeenCalledWith('Returning items', {
            count: 2,
            items: JSON.stringify(EXAMPLE_DB_GROCERY_ITEMS),
        });
    });

    it('should return status 200 and a list of grocery items', async () => {
        mockScan();

        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify(EXAMPLE_DB_GROCERY_ITEMS));
    });

    describe('When the scan request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

            const scanSpy = mockScan();
            scanSpy.mockRejectedValue(new Error('Scan failed'));

            await handler({} as any, {} as any, {} as any);

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Scan failed'));
        });

        it('should return status 500', async () => {
            const scanSpy = mockScan();
            scanSpy.mockRejectedValue(new Error('Scan failed'));

            const result = await handler({} as any, {} as any, {} as any);

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

const mockScan = () => jest.spyOn(DynamoDB, 'scan').mockResolvedValue(EXAMPLE_DB_GROCERY_ITEMS);

const EXAMPLE_DB_GROCERY_ITEMS: Array<ITodoItem> = [
    {
        id: "1",
        name: "Buy groceries",
        isDone: false,
    },
    {
        id: "2",
        name: "Go to the gym",
        isDone: false,
    },
];
