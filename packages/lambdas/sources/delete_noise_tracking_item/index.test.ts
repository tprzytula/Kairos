import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    deleteItem: jest.fn(),
}));

describe('Given the delete_noise_tracking_item lambda handler', () => {
    it('should require project ID', async () => {
        const result = await runHandler({ pathParameters: { timestamp: "1714003200000" } });

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should make a delete request to the noise tracking table', async () => {
        const deleteSpy = mockDelete();

        await runHandler({ pathParameters: { timestamp: "1714003200000" } }, true);

        expect(deleteSpy).toHaveBeenCalledWith({
            key: {
                projectId: "test-project",
                timestamp: 1714003200000,
            },
            tableName: DynamoDBTable.NOISE_TRACKING,
        });
    });

    it('should return status 200', async () => {
        mockDelete();

        const result = await runHandler({ pathParameters: { timestamp: "1714003200000" } }, true);

        expect(result.statusCode).toBe(200);
    });

    describe('When the delete request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            await runHandler({ pathParameters: { timestamp: "1714003200000" } }, true);

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Delete failed'));
        });

        it('should return status 500', async () => {
            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            const result = await runHandler({ pathParameters: { timestamp: "1714003200000" } }, true);

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

const mockDelete = () => jest.spyOn(DynamoDB, 'deleteItem');

interface IAPIGatewayProxyEvent {
    pathParameters: { timestamp?: unknown };
}

const runHandler = async ({ pathParameters }: IAPIGatewayProxyEvent, includeProjectId: boolean = false) => {
    const event = { pathParameters } as any;
    if (includeProjectId) {
        event.headers = { "X-Project-ID": "test-project" };
    }
    return await handler(event, {} as any, {} as any);
}