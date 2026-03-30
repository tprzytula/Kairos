import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { createRecipe } from ".";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    putItem: vi.fn(),
}));

vi.mock("node:crypto", () => ({
    randomUUID: () => "test-uuid",
}));

const VALID_INGREDIENT = { name: "Pasta", quantity: 500, unit: "g" as const };

describe('Given the createRecipe database function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a recipe with required fields', async () => {
        const id = await createRecipe({
            projectId: "test-project",
            name: "Pasta",
            ingredients: [VALID_INGREDIENT],
        });

        expect(id).toBe("test-uuid");
        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            item: expect.objectContaining({
                id: "test-uuid",
                projectId: "test-project",
                name: "Pasta",
                ingredients: JSON.stringify([VALID_INGREDIENT]),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }),
        });
    });

    it('should trim the name', async () => {
        await createRecipe({
            projectId: "test-project",
            name: "  Pasta  ",
            ingredients: [VALID_INGREDIENT],
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            item: expect.objectContaining({
                name: "Pasta",
            }),
        });
    });

    it('should stringify and include optional array fields when provided', async () => {
        await createRecipe({
            projectId: "test-project",
            name: "Pasta",
            ingredients: [VALID_INGREDIENT],
            instructions: ["Boil pasta"],
            mealTypes: ["dinner"],
            dishTypes: ["main"],
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            item: expect.objectContaining({
                instructions: JSON.stringify(["Boil pasta"]),
                mealTypes: JSON.stringify(["dinner"]),
                dishTypes: JSON.stringify(["main"]),
            }),
        });
    });

    it('should include imagePath and externalLink when provided', async () => {
        await createRecipe({
            projectId: "test-project",
            name: "Pasta",
            ingredients: [VALID_INGREDIENT],
            imagePath: "/img.jpg",
            externalLink: "https://example.com",
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            item: expect.objectContaining({
                imagePath: "/img.jpg",
                externalLink: "https://example.com",
            }),
        });
    });

    it('should not include optional fields when not provided', async () => {
        await createRecipe({
            projectId: "test-project",
            name: "Pasta",
            ingredients: [VALID_INGREDIENT],
        });

        const call = vi.mocked(DynamoDB.putItem).mock.calls[0][0];
        expect(call.item).not.toHaveProperty('instructions');
        expect(call.item).not.toHaveProperty('imagePath');
        expect(call.item).not.toHaveProperty('externalLink');
        expect(call.item).not.toHaveProperty('mealTypes');
        expect(call.item).not.toHaveProperty('dishTypes');
    });

    it('should set visibility to private when isPrivate is true', async () => {
        await createRecipe({
            projectId: "test-project",
            name: "Pasta",
            ingredients: [VALID_INGREDIENT],
            isPrivate: true,
            userId: "user-1",
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            item: expect.objectContaining({
                visibility: "private",
                ownerId: "user-1",
            }),
        });
    });

    it('should not include empty arrays', async () => {
        await createRecipe({
            projectId: "test-project",
            name: "Pasta",
            ingredients: [VALID_INGREDIENT],
            instructions: [],
            mealTypes: [],
            dishTypes: [],
        });

        const call = vi.mocked(DynamoDB.putItem).mock.calls[0][0];
        expect(call.item).not.toHaveProperty('instructions');
        expect(call.item).not.toHaveProperty('mealTypes');
        expect(call.item).not.toHaveProperty('dishTypes');
    });
});
