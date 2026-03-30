import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    putItem: vi.fn(),
}));

describe('Given the add_grocery_item_default lambda handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should require valid request body', async () => {
        const result = await handler({ body: null } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Invalid request body. 'name' is required.");
    });

    it('should require name in body', async () => {
        const result = await handler({ body: JSON.stringify({}) } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    describe('When creating a new grocery item default', () => {
        it('should call putItem with correct parameters', async () => {
            await handler({
                body: JSON.stringify({
                    name: "Avocado",
                    icon: "/icons/avocado.png",
                    unit: "piece",
                    category: "fruit",
                }),
            } as any, {} as any, {} as any);

            expect(DynamoDB.putItem).toHaveBeenCalledWith({
                tableName: DynamoDBTable.GROCERY_ITEMS_DEFAULTS,
                item: {
                    name: "Avocado",
                    icon: "/icons/avocado.png",
                    unit: "piece",
                    category: "fruit",
                },
            });
        });

        it('should trim the name', async () => {
            await handler({
                body: JSON.stringify({ name: "  Avocado  " }),
            } as any, {} as any, {} as any);

            expect(DynamoDB.putItem).toHaveBeenCalledWith({
                tableName: DynamoDBTable.GROCERY_ITEMS_DEFAULTS,
                item: {
                    name: "Avocado",
                },
            });
        });

        it('should not include optional fields when not provided', async () => {
            await handler({
                body: JSON.stringify({ name: "Avocado" }),
            } as any, {} as any, {} as any);

            const call = vi.mocked(DynamoDB.putItem).mock.calls[0][0];
            expect(call.item).not.toHaveProperty('icon');
            expect(call.item).not.toHaveProperty('unit');
            expect(call.item).not.toHaveProperty('category');
        });

        it('should return status 201 with the name', async () => {
            const result = await handler({
                body: JSON.stringify({ name: "Avocado" }),
            } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(201);
            expect(result.body).toBe(JSON.stringify({ name: "Avocado" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            vi.mocked(DynamoDB.putItem).mockRejectedValue(new Error('DB error'));

            const result = await handler({
                body: JSON.stringify({ name: "Avocado" }),
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
