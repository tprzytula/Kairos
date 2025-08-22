import { getBody } from "./body";
import { upsertItem } from "./database";
import { IRequestBody } from "./body/types";
import { getCategoryForItem } from "./utils";
import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";

import { handler } from "./index";

jest.mock('./body', () => ({
    getBody: jest.fn(),
}));

jest.mock('./database', () => ({
    upsertItem: jest.fn(),
}));

jest.mock('./utils', () => ({
    getCategoryForItem: jest.fn(),
}));

describe('Given the add_grocery_item lambda handler', () => {
    it('should require project ID', async () => {
        const result = await runHandler({ body: null });

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    describe('When the body is invalid', () => {
        it('should return status 400', async () => {
            jest.mocked(getBody).mockReturnValue(null);

            const result = await runHandler({ body: null }, true);

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the body is valid', () => {
        it('should fetch category and upsert the item in the grocery list table', async () => {
            jest.mocked(getBody).mockReturnValue(EXAMPLE_GROCERY_ITEM);
            jest.mocked(getCategoryForItem).mockResolvedValue(GroceryItemCategory.FRUITS_VEGETABLES);

            await runHandler({ body: JSON.stringify(EXAMPLE_GROCERY_ITEM) }, true);

            expect(jest.mocked(getCategoryForItem)).toHaveBeenCalledWith("Apple");
            expect(jest.mocked(upsertItem)).toHaveBeenCalledWith({
                ...EXAMPLE_GROCERY_ITEM,
                projectId: "test-project",
                category: GroceryItemCategory.FRUITS_VEGETABLES,
            });
        });

        describe('And the upsert succeeds', () => {
            it('should return status 200', async () => {
                jest.mocked(getBody).mockReturnValue(EXAMPLE_GROCERY_ITEM);
                jest.mocked(getCategoryForItem).mockResolvedValue(GroceryItemCategory.FRUITS_VEGETABLES);
                jest.mocked(upsertItem).mockResolvedValue({
                    id: EXAMPLE_ID,
                    statusCode: 200,
                });

                const result = await runHandler({ body: JSON.stringify(EXAMPLE_GROCERY_ITEM) }, true);

                expect(result.statusCode).toBe(200);
                expect(result.body).toEqual(JSON.stringify({ id: EXAMPLE_ID }));
            });
        });

        describe('And the upsert fails', () => {
            it('should return status 500', async () => {
                jest.mocked(getBody).mockReturnValue(EXAMPLE_GROCERY_ITEM);
                jest.mocked(getCategoryForItem).mockResolvedValue(GroceryItemCategory.FRUITS_VEGETABLES);
                jest.mocked(upsertItem).mockRejectedValue(new Error('Upsert failed'));

                const result = await runHandler({ body: JSON.stringify(EXAMPLE_GROCERY_ITEM) }, true);

                expect(result.statusCode).toBe(500);
            });
        });
    });
});

const EXAMPLE_GROCERY_ITEM: IRequestBody = {
    name: "Apple",
    quantity: "1",
    unit: "kg",
    imagePath: "/assets/images/generic-grocery-item.png",
}

const EXAMPLE_ID = "11111111-1111-1111-1111-111111111111";  

interface IAPIGatewayProxyEvent {
    body: string | null;
}

const runHandler = async ({ body }: IAPIGatewayProxyEvent, includeProjectId: boolean = false) => {
    const event = { body } as any;
    if (includeProjectId) {
        event.headers = { "X-Project-ID": "test-project" };
    }
    return await handler(event, {} as any, {} as any);
}