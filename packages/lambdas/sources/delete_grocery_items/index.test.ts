import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    deleteItems: vi.fn(),
    getItem: vi.fn(),
}));

describe('Given the delete_grocery_item lambda handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should require project ID', async () => {
        const result = await runHandler({ body: { ids: ["1", "2"] } });

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should return 400 when body is missing', async () => {
        const event = { body: null, headers: { "X-Project-ID": "test-project" } } as any;
        const result = await handler(event, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when ids is not an array', async () => {
        const event = {
            body: JSON.stringify({ ids: "not-an-array" }),
            headers: { "X-Project-ID": "test-project" }
        } as any;
        const result = await handler(event, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when ids is missing from body', async () => {
        const event = {
            body: JSON.stringify({}),
            headers: { "X-Project-ID": "test-project" }
        } as any;
        const result = await handler(event, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should return 403 when user does not own an item', async () => {
        vi.mocked(DynamoDB.getItem).mockResolvedValueOnce({ visibility: "private", ownerId: "other-user" });

        const result = await runHandler({ body: { ids: ["1", "2"] } }, true);

        expect(result.statusCode).toBe(403);
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
            const logSpy = vi.spyOn(console, 'error');

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
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },
                statusCode: 500,
            });
        });
    });
});

const mockDelete = () => vi.spyOn(DynamoDB, 'deleteItems');

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