import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";
import { handler } from "./index";

const { DynamoDBTable } = DynamoDB;

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    deleteItem: jest.fn(),
}));

describe('Given the delete_shop lambda handler', () => {
    it('should require project ID', async () => {
        const result = await runHandler({ pathParameters: { id: "1" } });

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should require valid shop ID in path parameters', async () => {
        const result = await runHandler({ pathParameters: {} }, true);

        expect(result.statusCode).toBe(400);
    });

    it('should make a delete request to the shops table', async () => {
        const deleteSpy = mockDelete();

        await runHandler({ pathParameters: { id: "test-shop-id" } }, true);

        expect(deleteSpy).toHaveBeenCalledWith({
            key: {
                id: "test-shop-id",
            },
            tableName: DynamoDBTable.SHOPS,
        });
    });

    it('should return status 200', async () => {
        mockDelete();

        const result = await runHandler({ pathParameters: { id: "test-shop-id" } }, true);

        expect(result.statusCode).toBe(200);
    });

    describe('When the delete request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            await runHandler({ pathParameters: { id: "test-shop-id" } }, true);

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Delete failed'));
        });

        it('should return status 500', async () => {
            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            const result = await runHandler({ pathParameters: { id: "test-shop-id" } }, true);

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
    pathParameters: { id?: unknown };
}

const runHandler = async ({ pathParameters }: IAPIGatewayProxyEvent, includeProjectId: boolean = false) => {
    const event = { pathParameters } as any;
    if (includeProjectId) {
        event.headers = { "X-Project-ID": "test-project" };
    }
    return await handler(event, {} as any, {} as any);
}
