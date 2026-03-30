import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { updateRecipe } from ".";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    updateItem: vi.fn(),
}));

const VALID_INGREDIENT = { name: "Pasta", quantity: 500, unit: "g" as const };

describe('Given the updateRecipe database function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should always include updatedAt', async () => {
        await updateRecipe("recipe-1", {});

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: {
                updatedAt: expect.any(String),
            },
        });
    });

    it('should include name when provided and trim it', async () => {
        await updateRecipe("recipe-1", { name: "  Updated  " });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                name: "Updated",
            }),
        });
    });

    it('should stringify ingredients when provided', async () => {
        await updateRecipe("recipe-1", { ingredients: [VALID_INGREDIENT] });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                ingredients: JSON.stringify([VALID_INGREDIENT]),
            }),
        });
    });

    it('should stringify non-empty instructions', async () => {
        await updateRecipe("recipe-1", { instructions: ["Boil"] });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                instructions: JSON.stringify(["Boil"]),
            }),
        });
    });

    it('should set instructions to null when empty', async () => {
        await updateRecipe("recipe-1", { instructions: [] });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                instructions: null,
            }),
        });
    });

    it('should stringify non-empty mealTypes and dishTypes', async () => {
        await updateRecipe("recipe-1", {
            mealTypes: ["dinner"],
            dishTypes: ["main"],
        });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                mealTypes: JSON.stringify(["dinner"]),
                dishTypes: JSON.stringify(["main"]),
            }),
        });
    });

    it('should set mealTypes and dishTypes to null when empty', async () => {
        await updateRecipe("recipe-1", {
            mealTypes: [],
            dishTypes: [],
        });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                mealTypes: null,
                dishTypes: null,
            }),
        });
    });

    it('should set externalLink to null when empty', async () => {
        await updateRecipe("recipe-1", { externalLink: "" });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                externalLink: null,
            }),
        });
    });

    it('should include imagePath when provided', async () => {
        await updateRecipe("recipe-1", { imagePath: "/img.jpg" });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                imagePath: "/img.jpg",
            }),
        });
    });

    it('should set visibility to private when isPrivate is true', async () => {
        await updateRecipe("recipe-1", { isPrivate: true, userId: "user-1" });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                visibility: "private",
                ownerId: "user-1",
            }),
        });
    });

    it('should clear visibility when isPrivate is false', async () => {
        await updateRecipe("recipe-1", { isPrivate: false });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.RECIPES,
            key: { id: "recipe-1" },
            updatedFields: expect.objectContaining({
                visibility: null,
                ownerId: null,
            }),
        });
    });
});
