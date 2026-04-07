import { handler } from "./index";
import * as database from "./database";
import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

vi.mock("./database");
vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    getItem: vi.fn(),
}));

describe('Given the update_recipe lambda handler', () => {
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

    it('should return 403 when user does not own the item', async () => {
        vi.mocked(DynamoDB.getItem).mockResolvedValueOnce({ visibility: "private", ownerId: "other-user" });

        const result = await handler({
            headers: { "X-Project-ID": "test-project" },
            body: JSON.stringify({ id: "recipe-1", name: "Updated" }),
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(403);
    });

    describe('When updating a recipe', () => {
        it('should call updateRecipe with correct parameters', async () => {
            vi.mocked(database.updateRecipe).mockResolvedValue();

            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    id: "recipe-1",
                    name: "Updated Pasta",
                    ingredients: [{ name: "Pasta", quantity: 500, unit: "g" }],
                    instructions: ["Boil"],
                }),
            } as any, {} as any, {} as any);

            expect(database.updateRecipe).toHaveBeenCalledWith("recipe-1", {
                name: "Updated Pasta",
                ingredients: [{ name: "Pasta", quantity: 500, unit: "g" }],
                instructions: ["Boil"],
                imagePath: undefined,
                externalLink: undefined,
                mealTypes: undefined,
                dishTypes: undefined,
                isPrivate: undefined,
                userId: undefined,
            });
        });

        it('should return status 200 with recipe id', async () => {
            vi.mocked(database.updateRecipe).mockResolvedValue();

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({ id: "recipe-1", name: "Updated" }),
            } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify({ id: "recipe-1" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            vi.mocked(database.updateRecipe).mockRejectedValue(new Error('DB error'));

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({ id: "recipe-1", name: "Updated" }),
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
