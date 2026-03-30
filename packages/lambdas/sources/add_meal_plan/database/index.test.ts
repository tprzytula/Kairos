import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { createMealPlan } from ".";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    putItem: vi.fn(),
}));

vi.mock("node:crypto", () => ({
    randomUUID: () => "test-uuid",
}));

describe('Given the createMealPlan database function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a meal plan with required fields', async () => {
        const id = await createMealPlan({
            projectId: "test-project",
            date: "2026-03-30",
            recipeName: "Pasta",
        });

        expect(id).toBe("test-uuid");
        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.MEAL_PLANS,
            item: expect.objectContaining({
                id: "test-uuid",
                projectId: "test-project",
                date: "2026-03-30",
                recipeName: "Pasta",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }),
        });
    });

    it('should trim string values', async () => {
        await createMealPlan({
            projectId: "test-project",
            date: "  2026-03-30  ",
            recipeName: "  Pasta  ",
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.MEAL_PLANS,
            item: expect.objectContaining({
                date: "2026-03-30",
                recipeName: "Pasta",
            }),
        });
    });

    it('should include optional fields when provided', async () => {
        await createMealPlan({
            projectId: "test-project",
            date: "2026-03-30",
            recipeName: "Pasta",
            recipeId: "recipe-1",
            mealType: "dinner",
            imagePath: "/img.jpg",
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.MEAL_PLANS,
            item: expect.objectContaining({
                recipeId: "recipe-1",
                mealType: "dinner",
                imagePath: "/img.jpg",
            }),
        });
    });

    it('should not include optional fields when not provided', async () => {
        await createMealPlan({
            projectId: "test-project",
            date: "2026-03-30",
            recipeName: "Pasta",
        });

        const call = vi.mocked(DynamoDB.putItem).mock.calls[0][0];
        expect(call.item).not.toHaveProperty('recipeId');
        expect(call.item).not.toHaveProperty('mealType');
        expect(call.item).not.toHaveProperty('imagePath');
    });

    it('should set visibility to private when isPrivate is true', async () => {
        await createMealPlan({
            projectId: "test-project",
            date: "2026-03-30",
            recipeName: "Pasta",
            isPrivate: true,
            userId: "user-1",
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.MEAL_PLANS,
            item: expect.objectContaining({
                visibility: "private",
                ownerId: "user-1",
            }),
        });
    });
});
