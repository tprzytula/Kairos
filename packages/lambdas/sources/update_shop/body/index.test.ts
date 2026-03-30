import { getBody } from ".";
import { IRequestBody } from "./types";

describe('Given the getBody function for update_shop', () => {
    it('should return null when body is null', () => {
        expect(getBody(null)).toBeNull();
    });

    describe('When the body is valid', () => {
        it('should return the body with name only', () => {
            const bodyWithName = {
                id: "test-id",
                name: "Updated Shop Name",
            };
            const body = getBody(JSON.stringify(bodyWithName));

            expect(body).toEqual(bodyWithName);
        });

        it('should return the body with icon only', () => {
            const bodyWithIcon = {
                id: "test-id",
                icon: "/assets/icons/updated-icon.png",
            };
            const body = getBody(JSON.stringify(bodyWithIcon));

            expect(body).toEqual(bodyWithIcon);
        });

        it('should return the body with both name and icon', () => {
            const body = getBody(JSON.stringify(EXAMPLE_UPDATE_BODY));

            expect(body).toEqual(EXAMPLE_UPDATE_BODY);
        });
    });

    describe('When the body is invalid', () => {
        it('should return null when body is empty object', () => {
            const body = getBody(JSON.stringify({}));

            expect(body).toBeNull();
        });

        it('should return null when id is missing', () => {
            const body = getBody(JSON.stringify({ name: 'Some Shop' }));

            expect(body).toBeNull();
        });

        it('should return null when no updatable fields provided', () => {
            const body = getBody(JSON.stringify({ id: 'test-id' }));

            expect(body).toBeNull();
        });

        it('should return null when name is empty string', () => {
            const body = getBody(JSON.stringify({ id: 'test-id', name: '' }));

            expect(body).toBeNull();
        });

        it('should return null when name is only whitespace', () => {
            const body = getBody(JSON.stringify({ id: 'test-id', name: '   ' }));

            expect(body).toBeNull();
        });

        it('should return null when name is a non-string type', () => {
            const body = getBody(JSON.stringify({ id: 'test-id', name: 123 }));

            expect(body).toBeNull();
        });

        it('should return null when icon is empty string', () => {
            const body = getBody(JSON.stringify({ id: 'test-id', icon: '' }));

            expect(body).toBeNull();
        });

        it('should return null when icon is a non-string type', () => {
            const body = getBody(JSON.stringify({ id: 'test-id', icon: 123 }));

            expect(body).toBeNull();
        });

        it('should accept null icon as valid (skip validation)', () => {
            const body = getBody(JSON.stringify({ id: 'test-id', name: 'Shop', icon: null }));

            expect(body).toEqual({ id: 'test-id', name: 'Shop', icon: null });
        });
    });

    describe('When the body is invalid JSON', () => {
        it('should return null', () => {
            const body = getBody('invalid JSON');

            expect(body).toBeNull();
        });
    });
});

const EXAMPLE_UPDATE_BODY: IRequestBody = {
    id: 'test-id',
    name: 'Updated Shop Name',
    icon: '/assets/icons/updated-icon.png',
};
