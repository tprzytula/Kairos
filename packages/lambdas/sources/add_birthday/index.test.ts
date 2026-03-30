import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    putItem: vi.fn(),
}));

vi.mock("node:crypto", () => ({
    randomUUID: () => "test-uuid",
}));

describe('Given the add_birthday lambda handler', () => {
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

    it('should require valid request body', async () => {
        const result = await handler({
            headers: { "X-Project-ID": "test-project" },
            body: JSON.stringify({}),
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    describe('When creating a new birthday', () => {
        it('should call putItem with correct parameters', async () => {
            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    name: "John",
                    month: 3,
                    day: 15,
                    birthYear: 1990,
                    notes: "Likes cake",
                }),
            } as any, {} as any, {} as any);

            expect(DynamoDB.putItem).toHaveBeenCalledWith({
                tableName: DynamoDBTable.BIRTHDAYS,
                item: {
                    id: "test-uuid",
                    projectId: "test-project",
                    name: "John",
                    month: 3,
                    day: 15,
                    birthYear: 1990,
                    notes: "Likes cake",
                },
            });
        });

        it('should not include optional fields when not provided', async () => {
            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    name: "John",
                    month: 3,
                    day: 15,
                }),
            } as any, {} as any, {} as any);

            expect(DynamoDB.putItem).toHaveBeenCalledWith({
                tableName: DynamoDBTable.BIRTHDAYS,
                item: {
                    id: "test-uuid",
                    projectId: "test-project",
                    name: "John",
                    month: 3,
                    day: 15,
                },
            });
        });

        it('should return status 201 with birthday id', async () => {
            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    name: "John",
                    month: 3,
                    day: 15,
                }),
            } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(201);
            expect(result.body).toBe(JSON.stringify({ id: "test-uuid" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            vi.mocked(DynamoDB.putItem).mockRejectedValue(new Error('DB error'));

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    name: "John",
                    month: 3,
                    day: 15,
                }),
            } as any, {} as any, {} as any);

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
