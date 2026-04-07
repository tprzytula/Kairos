import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";
import * as body from "./body";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    updateItem: vi.fn(),
}));

vi.mock("./body");

describe('Given the update_grocery_item_default lambda handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 when name path parameter is missing', async () => {
        const result = await handler({ pathParameters: {} } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when name path parameter is a non-string type', async () => {
        const result = await handler({ pathParameters: { name: 123 } } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when pathParameters is null', async () => {
        const result = await handler({ pathParameters: null } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when body is invalid', async () => {
        vi.mocked(body.getBody).mockReturnValue(null);

        const result = await handler({
            pathParameters: { name: "Avocado" },
            body: null,
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    describe('When updating a grocery item default', () => {
        it('should call updateItem with correct parameters', async () => {
            const updateBody = { icon: "/icons/new.png", unit: "kg" };
            vi.mocked(body.getBody).mockReturnValue(updateBody);

            await handler({
                pathParameters: { name: "Avocado" },
                body: JSON.stringify(updateBody),
            } as any, {} as any, {} as any);

            expect(DynamoDB.updateItem).toHaveBeenCalledWith({
                tableName: DynamoDBTable.GROCERY_ITEMS_DEFAULTS,
                key: { name: "Avocado" },
                updatedFields: updateBody,
            });
        });

        it('should return status 200 with name and updated fields', async () => {
            const updateBody = { icon: "/icons/new.png" };
            vi.mocked(body.getBody).mockReturnValue(updateBody);

            const result = await handler({
                pathParameters: { name: "Avocado" },
                body: JSON.stringify(updateBody),
            } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify({ name: "Avocado", icon: "/icons/new.png" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            vi.mocked(body.getBody).mockReturnValue({ icon: "/icons/new.png" });
            vi.mocked(DynamoDB.updateItem).mockRejectedValue(new Error('DB error'));

            const result = await handler({
                pathParameters: { name: "Avocado" },
                body: JSON.stringify({ icon: "/icons/new.png" }),
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
