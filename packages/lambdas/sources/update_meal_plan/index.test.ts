import { handler } from "./index";
import * as database from "./database";
import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

vi.mock("./database");
vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    getItem: vi.fn(),
}));

describe('Given the update_meal_plan lambda handler', () => {
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
            body: JSON.stringify({ id: "mp-1", date: "2026-04-01" }),
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(403);
    });

    describe('When updating a meal plan', () => {
        it('should call updateMealPlan with correct parameters', async () => {
            vi.mocked(database.updateMealPlan).mockResolvedValue();

            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    id: "mp-1",
                    date: "2026-04-01",
                    recipeName: "Updated Pasta",
                    mealType: "lunch",
                }),
            } as any, {} as any, {} as any);

            expect(database.updateMealPlan).toHaveBeenCalledWith("mp-1", {
                date: "2026-04-01",
                recipeName: "Updated Pasta",
                recipeId: undefined,
                mealType: "lunch",
                imagePath: undefined,
                isPrivate: undefined,
                userId: undefined,
            });
        });

        it('should return status 200 with meal plan id', async () => {
            vi.mocked(database.updateMealPlan).mockResolvedValue();

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({ id: "mp-1", date: "2026-04-01" }),
            } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify({ id: "mp-1" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            vi.mocked(database.updateMealPlan).mockRejectedValue(new Error('DB error'));

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({ id: "mp-1", date: "2026-04-01" }),
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
