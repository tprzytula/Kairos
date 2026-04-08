import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    updateItem: vi.fn(),
    getItem: vi.fn(),
}));

describe('Given the update_birthday lambda handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should require request body', async () => {
        const result = await handler({
            headers: { "X-Project-ID": "test-project" },
            body: null,
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should require valid request body with id', async () => {
        const result = await handler({
            headers: { "X-Project-ID": "test-project" },
            body: JSON.stringify({}),
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should return 403 when user does not own the item', async () => {
        vi.mocked(DynamoDB.getItem).mockResolvedValueOnce({ visibility: "private", ownerId: "other-user" });

        const result = await handler({
            headers: { "X-Project-ID": "test-project" },
            body: JSON.stringify({ id: "bday-1", name: "Jane" }),
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(403);
    });

    describe('When updating a birthday', () => {
        it('should call updateItem with correct parameters', async () => {
            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    id: "bday-1",
                    name: "Jane",
                    month: 6,
                    day: 20,
                }),
            } as any, {} as any, {} as any);

            expect(DynamoDB.updateItem).toHaveBeenCalledWith({
                tableName: DynamoDBTable.BIRTHDAYS,
                key: { id: "bday-1" },
                updatedFields: {
                    name: "Jane",
                    month: 6,
                    day: 20,
                },
            });
        });

        it('should set visibility to private when isPrivate is true', async () => {
            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({ id: "bday-1", name: "Jane", isPrivate: true }),
            } as any, {} as any, {} as any);

            expect(DynamoDB.updateItem).toHaveBeenCalledWith({
                tableName: DynamoDBTable.BIRTHDAYS,
                key: { id: "bday-1" },
                updatedFields: expect.objectContaining({
                    visibility: "private",
                }),
            });
        });

        it('should clear visibility when isPrivate is false', async () => {
            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({ id: "bday-1", name: "Jane", isPrivate: false }),
            } as any, {} as any, {} as any);

            expect(DynamoDB.updateItem).toHaveBeenCalledWith({
                tableName: DynamoDBTable.BIRTHDAYS,
                key: { id: "bday-1" },
                updatedFields: expect.objectContaining({
                    visibility: null,
                    ownerId: null,
                }),
            });
        });

        it('should return status 200 with updated fields', async () => {
            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    id: "bday-1",
                    name: "Jane",
                }),
            } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify({ id: "bday-1", name: "Jane" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            vi.mocked(DynamoDB.updateItem).mockRejectedValue(new Error('DB error'));

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({ id: "bday-1", name: "Jane" }),
            } as any, {} as any, {} as any);

            expect(result).toEqual({
                body: "Internal Server Error",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },
                statusCode: 500,
            });
        });
    });
});
