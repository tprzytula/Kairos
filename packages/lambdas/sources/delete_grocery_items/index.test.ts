import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    deleteItems: jest.fn(),
}));

describe('Given the delete_grocery_item lambda handler', () => {
    it('should make a delete request to the grocery list table', async () => {
        const deleteSpy = mockDelete();

        await runHandler({ body: { ids: ["1", "2"] } });

        expect(deleteSpy).toHaveBeenCalledWith({
            ids: ["1", "2"],
            tableName: DynamoDBTable.GROCERY_LIST,
        });
    });

    it('should return status 200', async () => {
        mockDelete();

        const result = await runHandler({ body: { ids: ["1", "2"] } });

        expect(result.statusCode).toBe(200);
    });

    describe('When the ids are not provided', () => {
        it('should return status 400', async () => {
            const result = await runHandler({ body: {} });

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the ids are not an array', () => {
        it('should return status 400', async () => {
            const result = await runHandler({ body: { ids: 1 as unknown as Array<string> } });

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the delete request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            await runHandler({ body: { ids: ["1", "2"] } });

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Delete failed'));
        });

        it('should return status 500', async () => {
            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            const result = await runHandler({ body: { ids: ["1", "2"] } });

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

const mockDelete = () => jest.spyOn(DynamoDB, 'deleteItems');

interface IAPIGatewayProxyEvent {
    body: { ids?: Array<string> };
}

const runHandler = async ({ body }: IAPIGatewayProxyEvent) => {
    return await handler({ body: JSON.stringify(body) } as any, {} as any, {} as any);
}