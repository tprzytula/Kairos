import { getBody } from "./body";
import { upsertItem, queryProjectItems } from "./database";
import { IRequestBody } from "./body/types";
import { fetchDefaults, getCategoryForItem } from "./utils";
import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";

import { handler } from "./index";

vi.mock('./body', async () => ({
    getBody: vi.fn(),
}));

vi.mock('./database', async () => ({
    upsertItem: vi.fn(),
    queryProjectItems: vi.fn(),
}));

vi.mock('./utils', async () => ({
    fetchDefaults: vi.fn(),
    getCategoryForItem: vi.fn(),
}));

describe('Given the add_grocery_item lambda handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(queryProjectItems).mockResolvedValue([]);
        vi.mocked(fetchDefaults).mockResolvedValue([]);
        vi.mocked(getCategoryForItem).mockReturnValue(GroceryItemCategory.OTHER);
    });

    it('should require project ID', async () => {
        const result = await runHandler({ body: null });

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    describe('When the body is invalid', () => {
        it('should return status 400', async () => {
            vi.mocked(getBody).mockReturnValue(null);

            const result = await runHandler({ body: null }, true);

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the body is valid with a single item', () => {
        it('should query project items and defaults once, then upsert', async () => {
            vi.mocked(getBody).mockReturnValue(EXAMPLE_BODY);
            vi.mocked(getCategoryForItem).mockReturnValue(GroceryItemCategory.FRUITS_VEGETABLES);
            vi.mocked(upsertItem).mockResolvedValue({ id: EXAMPLE_ID, statusCode: 201 });

            await runHandler({ body: JSON.stringify(EXAMPLE_BODY) }, true);

            expect(vi.mocked(queryProjectItems)).toHaveBeenCalledWith("test-project");
            expect(vi.mocked(fetchDefaults)).toHaveBeenCalledTimes(1);
            expect(vi.mocked(getCategoryForItem)).toHaveBeenCalledWith("Apple", []);
            expect(vi.mocked(upsertItem)).toHaveBeenCalledWith(
                expect.objectContaining({
                    projectId: "test-project",
                    name: "Apple",
                    category: GroceryItemCategory.FRUITS_VEGETABLES,
                }),
                [],
            );
        });

        it('should return items array with status 201 when all items are created', async () => {
            vi.mocked(getBody).mockReturnValue(EXAMPLE_BODY);
            vi.mocked(upsertItem).mockResolvedValue({ id: EXAMPLE_ID, statusCode: 201 });

            const result = await runHandler({ body: JSON.stringify(EXAMPLE_BODY) }, true);

            expect(result.statusCode).toBe(201);
            expect(result.body).toEqual(JSON.stringify({ items: [{ id: EXAMPLE_ID }] }));
        });
    });

    describe('When the body contains multiple items', () => {
        it('should upsert each item sequentially', async () => {
            vi.mocked(getBody).mockReturnValue(EXAMPLE_MULTI_BODY);
            vi.mocked(upsertItem)
                .mockResolvedValueOnce({ id: "id-1", statusCode: 201 })
                .mockResolvedValueOnce({ id: "id-2", statusCode: 201 });

            const result = await runHandler({ body: JSON.stringify(EXAMPLE_MULTI_BODY) }, true);

            expect(vi.mocked(upsertItem)).toHaveBeenCalledTimes(2);
            expect(result.statusCode).toBe(201);
            expect(result.body).toEqual(JSON.stringify({
                items: [{ id: "id-1" }, { id: "id-2" }],
            }));
        });

        it('should return status 200 when some items are updates', async () => {
            vi.mocked(getBody).mockReturnValue(EXAMPLE_MULTI_BODY);
            vi.mocked(upsertItem)
                .mockResolvedValueOnce({ id: "id-1", statusCode: 200 })
                .mockResolvedValueOnce({ id: "id-2", statusCode: 201 });

            const result = await runHandler({ body: JSON.stringify(EXAMPLE_MULTI_BODY) }, true);

            expect(result.statusCode).toBe(200);
        });
    });

    describe('When the upsert fails', () => {
        it('should return status 500', async () => {
            vi.mocked(getBody).mockReturnValue(EXAMPLE_BODY);
            vi.mocked(upsertItem).mockRejectedValue(new Error('Upsert failed'));

            const result = await runHandler({ body: JSON.stringify(EXAMPLE_BODY) }, true);

            expect(result.statusCode).toBe(500);
        });
    });
});

const EXAMPLE_BODY: IRequestBody = {
    items: [{
        name: "Apple",
        quantity: 1,
        unit: "kg",
        shopId: "shop-1",
        imagePath: "/assets/images/generic-grocery-item.png",
    }],
};

const EXAMPLE_MULTI_BODY: IRequestBody = {
    items: [
        {
            name: "Apple",
            quantity: 1,
            unit: "kg",
            shopId: "shop-1",
            imagePath: "/assets/images/apple.png",
        },
        {
            name: "Banana",
            quantity: 3,
            unit: "unit",
            shopId: "shop-1",
            imagePath: "/assets/images/banana.png",
        },
    ],
};

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
