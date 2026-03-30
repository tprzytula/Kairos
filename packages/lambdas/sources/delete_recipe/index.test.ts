import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    deleteItem: vi.fn(),
}));

describe('Given the delete_recipe lambda handler', () => {
    it('should require project ID', async () => {
        const result = await runHandler({ pathParameters: { id: "1" } });

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should return 400 when id is missing', async () => {
        const result = await runHandler({ pathParameters: {} }, true);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when id is a non-string type', async () => {
        const result = await runHandler({ pathParameters: { id: 123 as unknown } }, true);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when pathParameters is null', async () => {
        const event = { pathParameters: null, headers: { "X-Project-ID": "test-project" } } as any;
        const result = await handler(event, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should make a delete request to the recipes table', async () => {
        const deleteSpy = mockDelete();

        await runHandler({ pathParameters: { id: "1" } }, true);

        expect(deleteSpy).toHaveBeenCalledWith({
            key: {
                id: "1",
            },
            tableName: DynamoDBTable.RECIPES,
        });
    });

    it('should return status 200', async () => {
        mockDelete();

        const result = await runHandler({ pathParameters: { id: "1" } }, true);

        expect(result.statusCode).toBe(200);
    });

    describe('When the delete request fails', () => {
        it('should log the error', async () => {
            const logSpy = vi.spyOn(console, 'error');

            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            await runHandler({ pathParameters: { id: "1" } }, true);

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Delete failed'));
        });

        it('should return status 500', async () => {
            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            const result = await runHandler({ pathParameters: { id: "1" } }, true);

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

const mockDelete = () => vi.spyOn(DynamoDB, 'deleteItem');

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
