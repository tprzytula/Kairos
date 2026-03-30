import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { updateMealPlan } from ".";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    updateItem: vi.fn(),
}));

describe('Given the updateMealPlan database function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should always include updatedAt', async () => {
        await updateMealPlan("mp-1", {});

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.MEAL_PLANS,
            key: { id: "mp-1" },
            updatedFields: {
                updatedAt: expect.any(String),
            },
        });
    });

    it('should include date when provided and trim it', async () => {
        await updateMealPlan("mp-1", { date: "  2026-04-01  " });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.MEAL_PLANS,
            key: { id: "mp-1" },
            updatedFields: expect.objectContaining({
                date: "2026-04-01",
            }),
        });
    });

    it('should include recipeName when provided and trim it', async () => {
        await updateMealPlan("mp-1", { recipeName: "  Pasta  " });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.MEAL_PLANS,
            key: { id: "mp-1" },
            updatedFields: expect.objectContaining({
                recipeName: "Pasta",
            }),
        });
    });

    it('should set nullable fields to null when empty', async () => {
        await updateMealPlan("mp-1", {
            recipeId: null,
            mealType: null,
            imagePath: null,
        });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.MEAL_PLANS,
            key: { id: "mp-1" },
            updatedFields: expect.objectContaining({
                recipeId: null,
                mealType: null,
                imagePath: null,
            }),
        });
    });

    it('should not include fields that are not provided', async () => {
        await updateMealPlan("mp-1", { date: "2026-04-01" });

        const call = vi.mocked(DynamoDB.updateItem).mock.calls[0][0];
        expect(call.updatedFields).not.toHaveProperty('recipeName');
        expect(call.updatedFields).not.toHaveProperty('recipeId');
        expect(call.updatedFields).not.toHaveProperty('mealType');
        expect(call.updatedFields).not.toHaveProperty('imagePath');
    });
});
