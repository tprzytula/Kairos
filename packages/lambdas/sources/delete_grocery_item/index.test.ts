import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTables } = DynamoDB;

import { handler } from "./index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    deleteItem: jest.fn(),
}));

describe('Given the delete_grocery_item lambda handler', () => {
    it('should make a delete request to the grocery list table', async () => {
        const deleteSpy = mockDelete();

        await runHandler({ pathParameters: { id: "1" } });

        expect(deleteSpy).toHaveBeenCalledWith({
            id: "1",
            tableName: DynamoDBTables.GROCERY_LIST,
        });
    });

    it('should return status 200', async () => {
        mockDelete();

        const result = await runHandler({ pathParameters: { id: "1" } });

        expect(result.statusCode).toBe(200);
    });

    describe('When the id is not provided', () => {
        it('should return status 400', async () => {
            const result = await runHandler({ pathParameters: {} });

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the id is not a string', () => {
        it('should return status 400', async () => {
            const result = await runHandler({ pathParameters: { id: 1 } });

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the delete request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            await runHandler({ pathParameters: { id: "1" } });

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Delete failed'));
        });

        it('should return status 500', async () => {
            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            const result = await runHandler({ pathParameters: { id: "1" } });

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

const mockDelete = () => jest.spyOn(DynamoDB, 'deleteItem');

interface IAPIGatewayProxyEvent {
    pathParameters: { id?: unknown };
}

const runHandler = async ({ pathParameters }: IAPIGatewayProxyEvent) => {
    return await handler({ pathParameters } as any, {} as any, {} as any);
}