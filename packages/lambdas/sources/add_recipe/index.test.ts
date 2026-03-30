import { handler } from "./index";
import * as database from "./database";

vi.mock("./database");

const VALID_BODY = {
    name: "Pasta Carbonara",
    ingredients: [{ name: "Pasta", quantity: 500, unit: "g" }],
};

describe('Given the add_recipe lambda handler', () => {
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

    describe('When creating a new recipe', () => {
        it('should call createRecipe with correct parameters', async () => {
            vi.mocked(database.createRecipe).mockResolvedValue("new-id");

            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    ...VALID_BODY,
                    instructions: ["Boil pasta"],
                    imagePath: "/img.jpg",
                    externalLink: "https://example.com",
                    mealTypes: ["dinner"],
                    dishTypes: ["main"],
                }),
            } as any, {} as any, {} as any);

            expect(database.createRecipe).toHaveBeenCalledWith({
                projectId: "test-project",
                name: "Pasta Carbonara",
                ingredients: [{ name: "Pasta", quantity: 500, unit: "g" }],
                instructions: ["Boil pasta"],
                imagePath: "/img.jpg",
                externalLink: "https://example.com",
                mealTypes: ["dinner"],
                dishTypes: ["main"],
            });
        });

        it('should return status 201 with recipe id', async () => {
            vi.mocked(database.createRecipe).mockResolvedValue("new-id");

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify(VALID_BODY),
            } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(201);
            expect(result.body).toBe(JSON.stringify({ id: "new-id" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            vi.mocked(database.createRecipe).mockRejectedValue(new Error('DB error'));

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify(VALID_BODY),
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
