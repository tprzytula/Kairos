import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    deleteItem: jest.fn(),
}));

describe('Given the delete_noise_tracking_item lambda handler', () => {
    it('should make a delete request to the noise tracking table', async () => {
        const deleteSpy = mockDelete();

        await runHandler({ pathParameters: { timestamp: 1714003200000 } });

        expect(deleteSpy).toHaveBeenCalledWith({
            key: {
                timestamp: 1714003200000,
            },
            tableName: DynamoDBTable.NOISE_TRACKING,
        });
    });

    it('should return status 200', async () => {
        mockDelete();

        const result = await runHandler({ pathParameters: { timestamp: 1714003200000 } });

        expect(result.statusCode).toBe(200);
    });

    describe('When the timestamp is not provided', () => {
        it('should return status 400', async () => {
            const result = await runHandler({ pathParameters: {} });

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the delete request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            await runHandler({ pathParameters: { timestamp: 1714003200000 } });

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Delete failed'));
        });

        it('should return status 500', async () => {
            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            const result = await runHandler({ pathParameters: { timestamp: "1714003200000" } });

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
    pathParameters: { timestamp?: unknown };
}

const runHandler = async ({ pathParameters }: IAPIGatewayProxyEvent) => {
    return await handler({ pathParameters } as any, {} as any, {} as any);
}