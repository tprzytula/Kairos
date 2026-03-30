import { getBody } from ".";

const VALID_INGREDIENT = { name: "Pasta", quantity: 500, unit: "g" };

describe('Given the getBody function for add_recipe', () => {
    describe('When the body is valid', () => {
        it('should return the body with required fields', () => {
            const body = getBody(JSON.stringify({
                name: "Pasta",
                ingredients: [VALID_INGREDIENT],
            }));

            expect(body).toEqual({ name: "Pasta", ingredients: [VALID_INGREDIENT] });
        });

        it('should return the body with optional fields', () => {
            const input = {
                name: "Pasta",
                ingredients: [VALID_INGREDIENT],
                instructions: ["Boil"],
                imagePath: "/img.jpg",
                externalLink: "https://example.com",
                mealTypes: ["dinner"],
                dishTypes: ["main"],
            };
            const body = getBody(JSON.stringify(input));

            expect(body).toEqual(input);
        });
    });

    describe('When the body is invalid', () => {
        it('should return null when body is null', () => {
            expect(getBody(null)).toBeNull();
        });

        it('should return null when name is missing', () => {
            expect(getBody(JSON.stringify({ ingredients: [VALID_INGREDIENT] }))).toBeNull();
        });

        it('should return null when name is empty', () => {
            expect(getBody(JSON.stringify({ name: "", ingredients: [VALID_INGREDIENT] }))).toBeNull();
        });

        it('should return null when ingredients is missing', () => {
            expect(getBody(JSON.stringify({ name: "Pasta" }))).toBeNull();
        });

        it('should return null when ingredients is empty array', () => {
            expect(getBody(JSON.stringify({ name: "Pasta", ingredients: [] }))).toBeNull();
        });

        it('should return null when ingredients is not an array', () => {
            expect(getBody(JSON.stringify({ name: "Pasta", ingredients: "bad" }))).toBeNull();
        });

        it('should return null when ingredient name is missing', () => {
            expect(getBody(JSON.stringify({
                name: "Pasta",
                ingredients: [{ quantity: 500, unit: "g" }],
            }))).toBeNull();
        });

        it('should return null when ingredient name is empty', () => {
            expect(getBody(JSON.stringify({
                name: "Pasta",
                ingredients: [{ name: "", quantity: 500, unit: "g" }],
            }))).toBeNull();
        });

        it('should return null when ingredient quantity is missing', () => {
            expect(getBody(JSON.stringify({
                name: "Pasta",
                ingredients: [{ name: "Pasta", unit: "g" }],
            }))).toBeNull();
        });

        it('should return null when ingredient quantity is zero', () => {
            expect(getBody(JSON.stringify({
                name: "Pasta",
                ingredients: [{ name: "Pasta", quantity: 0, unit: "g" }],
            }))).toBeNull();
        });

        it('should return null when ingredient unit is missing', () => {
            expect(getBody(JSON.stringify({
                name: "Pasta",
                ingredients: [{ name: "Pasta", quantity: 500 }],
            }))).toBeNull();
        });

        it('should return null when ingredient unit is empty', () => {
            expect(getBody(JSON.stringify({
                name: "Pasta",
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
