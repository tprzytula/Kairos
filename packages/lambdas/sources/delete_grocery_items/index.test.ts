import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    deleteItems: jest.fn(),
}));

describe('Given the delete_grocery_item lambda handler', () => {
    it('should require project ID', async () => {
        const result = await runHandler({ body: { ids: ["1", "2"] } });

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should make a delete request to the grocery list table', async () => {
        const deleteSpy = mockDelete();

        await runHandler({ body: { ids: ["1", "2"] } }, true);

        expect(deleteSpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.GROCERY_LIST,
            ids: ["1", "2"],
        });
    });

    it('should return status 200', async () => {
        mockDelete();

        const result = await runHandler({ body: { ids: ["1", "2"] } }, true);

        expect(result.statusCode).toBe(200);
    });

    describe('When the delete request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            await runHandler({ body: { ids: ["1", "2"] } }, true);

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Delete failed'));
        });

        it('should return status 500', async () => {
            const deleteSpy = mockDelete();
            deleteSpy.mockRejectedValue(new Error('Delete failed'));

            const result = await runHandler({ body: { ids: ["1", "2"] } }, true);

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

const runHandler = async ({ body }: IAPIGatewayProxyEvent, includeProjectId: boolean = false) => {
    const event = { body: JSON.stringify(body) } as any;
    if (includeProjectId) {
        event.headers = { "X-Project-ID": "test-project" };
    }
    return await handler(event, {} as any, {} as any);
}