import { getBody } from ".";
import { IRequestBody } from "./types";

describe('Given the getBody function', () => {
    describe('When the body is valid', () => {
        it('should return the body', () => {
            const body = getBody(JSON.stringify(EXAMPLE_SHOP));

            expect(body).toEqual(EXAMPLE_SHOP);
        });

        it('should return the body even without icon', () => {
            const shopWithoutIcon = {
                name: 'Test Shop',
            };
            const body = getBody(JSON.stringify(shopWithoutIcon));

            expect(body).toEqual(shopWithoutIcon);
        });
    });

    describe('When the body is invalid', () => {
        it('should return null when body is empty object', () => {
            const body = getBody(JSON.stringify({}));

            expect(body).toBeNull();
        });

        it('should return null when name is missing', () => {
            const body = getBody(JSON.stringify({ icon: 'some-icon' }));

            expect(body).toBeNull();
        });

        it('should return null when name is empty string', () => {
            const body = getBody(JSON.stringify({ name: '' }));

            expect(body).toBeNull();
        });

        it('should return null when name is only whitespace', () => {
            const body = getBody(JSON.stringify({ name: '   ' }));

            expect(body).toBeNull();
        });

        it('should return null when icon is empty string', () => {
            const body = getBody(JSON.stringify({ name: 'Test Shop', icon: '' }));

            expect(body).toBeNull();
        });
    });

    describe('When the body is invalid JSON', () => {
        it('should return null', () => {
            const body = getBody('invalid JSON');

            expect(body).toBeNull();
        });

        it('should log the error', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            getBody('invalid JSON');

            expect(consoleSpy).toHaveBeenCalledWith('Failed to parse body:', new SyntaxError(`Unexpected token 'i', "invalid JSON" is not valid JSON`));
        });
    });
});

const EXAMPLE_SHOP: IRequestBody = {
    name: 'Grocery Store',
    icon: '/assets/icons/generic-grocery-item.png',
};
