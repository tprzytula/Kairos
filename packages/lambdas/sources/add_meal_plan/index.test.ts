import { handler } from "./index";
import * as database from "./database";

vi.mock("./database");

describe('Given the add_meal_plan lambda handler', () => {
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

    describe('When creating a new meal plan', () => {
        it('should call createMealPlan with correct parameters', async () => {
            vi.mocked(database.createMealPlan).mockResolvedValue("new-id");

            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    date: "2026-03-30",
                    recipeName: "Pasta",
                    recipeId: "recipe-1",
                    mealType: "dinner",
                    imagePath: "/img.jpg",
                }),
            } as any, {} as any, {} as any);

            expect(database.createMealPlan).toHaveBeenCalledWith({
                projectId: "test-project",
                date: "2026-03-30",
                recipeName: "Pasta",
                recipeId: "recipe-1",
                mealType: "dinner",
                imagePath: "/img.jpg",
            });
        });

        it('should return status 201 with meal plan id', async () => {
            vi.mocked(database.createMealPlan).mockResolvedValue("new-id");

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    date: "2026-03-30",
                    recipeName: "Pasta",
                }),
            } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(201);
            expect(result.body).toBe(JSON.stringify({ id: "new-id" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            vi.mocked(database.createMealPlan).mockRejectedValue(new Error('DB error'));

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    date: "2026-03-30",
                    recipeName: "Pasta",
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
