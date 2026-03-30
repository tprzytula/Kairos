import { getBody } from ".";

describe('Given the getBody function for update_grocery_item_default', () => {
    describe('When the body is valid', () => {
        it('should return the body with icon', () => {
            const body = getBody(JSON.stringify({ icon: "/icon.png" }));

            expect(body).toEqual({ icon: "/icon.png" });
        });

        it('should return the body with unit', () => {
            const body = getBody(JSON.stringify({ unit: "kg" }));

            expect(body).toEqual({ unit: "kg" });
        });

        it('should return the body with category', () => {
            const body = getBody(JSON.stringify({ category: "fruit" }));

            expect(body).toEqual({ category: "fruit" });
        });

        it('should return the body with multiple fields', () => {
            const input = { icon: "/icon.png", unit: "kg", category: "fruit" };
            const body = getBody(JSON.stringify(input));

            expect(body).toEqual(input);
        });

        it('should allow null for nullable fields', () => {
            const input = { icon: null };
            const body = getBody(JSON.stringify(input));

            expect(body).toEqual(input);
        });
    });

    describe('When the body is invalid', () => {
        it('should return null when body is null', () => {
            expect(getBody(null)).toBeNull();
        });

        it('should return null when no fields are provided', () => {
            expect(getBody(JSON.stringify({}))).toBeNull();
        });

        it('should return null when icon is empty string', () => {
            expect(getBody(JSON.stringify({ icon: "" }))).toBeNull();
        });

        it('should return null when icon is only whitespace', () => {
            expect(getBody(JSON.stringify({ icon: "   " }))).toBeNull();
        });

        it('should return null when unit is empty string', () => {
            expect(getBody(JSON.stringify({ unit: "" }))).toBeNull();
        });

        it('should return null when unit is only whitespace', () => {
            expect(getBody(JSON.stringify({ unit: "   " }))).toBeNull();
        });

        it('should return null when category is empty string', () => {
            expect(getBody(JSON.stringify({ category: "" }))).toBeNull();
        });

        it('should return null when category is only whitespace', () => {
            expect(getBody(JSON.stringify({ category: "   " }))).toBeNull();
        });
    });

    describe('When the body is invalid JSON', () => {
        it('should return null', () => {
            expect(getBody('invalid')).toBeNull();
        });
    });
});
