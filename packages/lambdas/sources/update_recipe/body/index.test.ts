import { getBody } from ".";

const VALID_INGREDIENT = { name: "Pasta", quantity: 500, unit: "g" };

describe('Given the getBody function for update_recipe', () => {
    describe('When the body is valid', () => {
        it('should return the body with id only', () => {
            const body = getBody(JSON.stringify({ id: "recipe-1" }));

            expect(body).toEqual({ id: "recipe-1" });
        });

        it('should return the body with optional fields', () => {
            const input = {
                id: "recipe-1",
                name: "Updated",
                ingredients: [VALID_INGREDIENT],
                instructions: ["Boil"],
            };
            const body = getBody(JSON.stringify(input));

            expect(body).toEqual(input);
        });
    });

    describe('When the body is invalid', () => {
        it('should return null when body is null', () => {
            expect(getBody(null)).toBeNull();
        });

        it('should return null when id is missing', () => {
            expect(getBody(JSON.stringify({ name: "Updated" }))).toBeNull();
        });

        it('should return null when id is not a string', () => {
            expect(getBody(JSON.stringify({ id: 123 }))).toBeNull();
        });

        it('should return null when name is empty', () => {
            expect(getBody(JSON.stringify({ id: "recipe-1", name: "" }))).toBeNull();
        });

        it('should return null when name is only whitespace', () => {
            expect(getBody(JSON.stringify({ id: "recipe-1", name: "   " }))).toBeNull();
        });

        it('should return null when ingredients is empty array', () => {
            expect(getBody(JSON.stringify({ id: "recipe-1", ingredients: [] }))).toBeNull();
        });

        it('should return null when ingredients is not an array', () => {
            expect(getBody(JSON.stringify({ id: "recipe-1", ingredients: "bad" }))).toBeNull();
        });

        it('should return null when ingredient is invalid', () => {
            expect(getBody(JSON.stringify({
                id: "recipe-1",
                ingredients: [{ name: "", quantity: 500, unit: "g" }],
            }))).toBeNull();
        });

        it('should return null when ingredient quantity is zero', () => {
            expect(getBody(JSON.stringify({
                id: "recipe-1",
                ingredients: [{ name: "Pasta", quantity: 0, unit: "g" }],
            }))).toBeNull();
        });

        it('should return null when ingredient unit is empty', () => {
            expect(getBody(JSON.stringify({
                id: "recipe-1",
                ingredients: [{ name: "Pasta", quantity: 500, unit: "" }],
            }))).toBeNull();
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
