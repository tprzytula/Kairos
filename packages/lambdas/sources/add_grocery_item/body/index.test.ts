import { getBody } from ".";
import { IRequestBody, IRequestBodyItem } from "./types";

describe('Given the getBody function', () => {
    describe('When the body contains a valid items array', () => {
        it('should return the body', () => {
            const body = getBody(JSON.stringify(EXAMPLE_BODY));

            expect(body).toEqual(EXAMPLE_BODY);
        });

        it('should accept a single item', () => {
            const singleItemBody = { items: [EXAMPLE_ITEM] };
            const body = getBody(JSON.stringify(singleItemBody));

            expect(body).toEqual(singleItemBody);
        });
    });

    describe('When the items array is empty', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({ items: [] }));

            expect(body).toBeNull();
        });
    });

    describe('When the items array exceeds max batch size', () => {
        it('should return null for more than 25 items', () => {
            const items = Array.from({ length: 26 }, (_, i) => ({
                ...EXAMPLE_ITEM,
                name: `Item ${i}`,
            }));
            const body = getBody(JSON.stringify({ items }));

            expect(body).toBeNull();
        });

        it('should accept exactly 25 items', () => {
            const items = Array.from({ length: 25 }, (_, i) => ({
                ...EXAMPLE_ITEM,
                name: `Item ${i}`,
            }));
            const body = getBody(JSON.stringify({ items }));

            expect(body).toEqual({ items });
        });
    });

    describe('When items is not an array', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({ items: 'not an array' }));

            expect(body).toBeNull();
        });
    });

    describe('When items field is missing', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({ name: 'test' }));

            expect(body).toBeNull();
        });
    });

    describe.each(['name', 'quantity', 'unit', 'shopId', 'imagePath'])(
        'When an item is missing the %s field',
        (field) => {
            it('should return null', () => {
                const body = getBody(JSON.stringify({
                    items: [{ ...EXAMPLE_ITEM, [field]: undefined }],
                }));

                expect(body).toBeNull();
            });
        },
    );

    describe('When an item has invalid quantity', () => {
        it('should return null for quantity less than 1', () => {
            const body = getBody(JSON.stringify({
                items: [{ ...EXAMPLE_ITEM, quantity: 0 }],
            }));

            expect(body).toBeNull();
        });

        it('should return null for NaN quantity', () => {
            const body = getBody(JSON.stringify({
                items: [{ ...EXAMPLE_ITEM, quantity: 'abc' }],
            }));

            expect(body).toBeNull();
        });
    });

    describe('When one item is valid and another is invalid', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                items: [EXAMPLE_ITEM, { ...EXAMPLE_ITEM, name: undefined }],
            }));

            expect(body).toBeNull();
        });
    });

    describe('When the body is null', () => {
        it('should return null', () => {
            const body = getBody(null);

            expect(body).toBeNull();
        });
    });

    describe('When the body is invalid JSON', () => {
        it('should return null', () => {
            const body = getBody('invalid JSON');

            expect(body).toBeNull();
        });

        it('should log the error', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            getBody('invalid JSON');

            expect(consoleSpy).toHaveBeenCalledWith('Failed to parse body:', expect.any(SyntaxError));
            consoleSpy.mockRestore();
        });
    });
});

const EXAMPLE_ITEM: IRequestBodyItem = {
    name: 'Example Item',
    quantity: 1,
    unit: 'kg',
    shopId: 'shop-1',
    imagePath: 'https://example.com/image.jpg',
};

const EXAMPLE_BODY: IRequestBody = {
    items: [
        EXAMPLE_ITEM,
        {
            name: 'Another Item',
            quantity: 2,
            unit: 'unit',
            shopId: 'shop-1',
            imagePath: 'https://example.com/image2.jpg',
        },
    ],
};
