import { getBody } from "./body";
import { upsertItem } from "./database";
import { IRequestBody } from "./body/types";

import { handler } from "./index";

jest.mock('./body', () => ({
    getBody: jest.fn(),
}));

jest.mock('./database', () => ({
    upsertItem: jest.fn(),
}));

describe('Given the add_grocery_item lambda handler', () => {
    describe('When the body is invalid', () => {
        it('should return status 400', async () => {
            jest.mocked(getBody).mockReturnValue(null);

            const result = await runHandler({ body: null });

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the body is valid', () => {
        it('should upsert the item in the grocery list table', async () => {
            jest.mocked(getBody).mockReturnValue(EXAMPLE_GROCERY_ITEM);

            await runHandler({ body: JSON.stringify(EXAMPLE_GROCERY_ITEM) });

            expect(jest.mocked(upsertItem)).toHaveBeenCalledWith(EXAMPLE_GROCERY_ITEM);
        });

        describe('And the upsert succeeds', () => {
            it('should return status 200', async () => {
                jest.mocked(getBody).mockReturnValue(EXAMPLE_GROCERY_ITEM);
                jest.mocked(upsertItem).mockResolvedValue({
                    id: EXAMPLE_ID,
                    statusCode: 200,
                });

                const result = await runHandler({ body: JSON.stringify(EXAMPLE_GROCERY_ITEM) });

                expect(result.statusCode).toBe(200);
                expect(result.body).toEqual(JSON.stringify({ id: EXAMPLE_ID }));
            });
        });

        describe('And the upsert fails', () => {
            it('should return status 500', async () => {
                jest.mocked(upsertItem).mockRejectedValue(new Error('Upsert failed'));

                const result = await runHandler({ body: JSON.stringify(EXAMPLE_GROCERY_ITEM) });

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

const runHandler = async ({ body }: IAPIGatewayProxyEvent) => {
    return await handler({ body } as any, {} as any, {} as any);
}