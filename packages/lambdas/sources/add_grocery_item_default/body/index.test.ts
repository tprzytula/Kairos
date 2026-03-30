import { getBody } from ".";

describe('Given the getBody function for add_grocery_item_default', () => {
    describe('When the body is valid', () => {
        it('should return the body with name only', () => {
            const body = getBody(JSON.stringify({ name: "Avocado" }));

            expect(body).toEqual({ name: "Avocado" });
        });

        it('should return the body with optional fields', () => {
            const input = { name: "Avocado", icon: "/icon.png", unit: "piece", category: "fruit" };
            const body = getBody(JSON.stringify(input));

            expect(body).toEqual(input);
        });
    });

    describe('When the body is invalid', () => {
        it('should return null when body is null', () => {
            expect(getBody(null)).toBeNull();
        });

        it('should return null when name is missing', () => {
            expect(getBody(JSON.stringify({}))).toBeNull();
        });

        it('should return null when name is empty', () => {
            expect(getBody(JSON.stringify({ name: "" }))).toBeNull();
        });

        it('should return null when name is only whitespace', () => {
            expect(getBody(JSON.stringify({ name: "   " }))).toBeNull();
        });

        it('should return null when name is not a string', () => {
            expect(getBody(JSON.stringify({ name: 123 }))).toBeNull();
        });
    });

    describe('When the body is invalid JSON', () => {
        it('should return null', () => {
            expect(getBody('invalid')).toBeNull();
        });

        it('should log the error', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            getBody('invalid');
            expect(consoleSpy).toHaveBeenCalledWith('Failed to parse body:', expect.any(SyntaxError));
        });
    });
});
