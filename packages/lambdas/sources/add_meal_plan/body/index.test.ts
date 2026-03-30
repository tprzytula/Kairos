import { getBody } from ".";

describe('Given the getBody function for add_meal_plan', () => {
    describe('When the body is valid', () => {
        it('should return the body with required fields', () => {
            const body = getBody(JSON.stringify({ date: "2026-03-30", recipeName: "Pasta" }));

            expect(body).toEqual({ date: "2026-03-30", recipeName: "Pasta" });
        });

        it('should return the body with optional fields', () => {
            const input = {
                date: "2026-03-30",
                recipeName: "Pasta",
                recipeId: "recipe-1",
                mealType: "dinner",
                imagePath: "/img.jpg",
            };
            const body = getBody(JSON.stringify(input));

            expect(body).toEqual(input);
        });
    });

    describe('When the body is invalid', () => {
        it('should return null when body is null', () => {
            expect(getBody(null)).toBeNull();
        });

        it('should return null when date is missing', () => {
            expect(getBody(JSON.stringify({ recipeName: "Pasta" }))).toBeNull();
        });

        it('should return null when date is empty', () => {
            expect(getBody(JSON.stringify({ date: "", recipeName: "Pasta" }))).toBeNull();
        });

        it('should return null when recipeName is missing', () => {
            expect(getBody(JSON.stringify({ date: "2026-03-30" }))).toBeNull();
        });

        it('should return null when recipeName is empty', () => {
            expect(getBody(JSON.stringify({ date: "2026-03-30", recipeName: "" }))).toBeNull();
        });

        it('should return null when recipeId is not a string', () => {
            expect(getBody(JSON.stringify({ date: "2026-03-30", recipeName: "Pasta", recipeId: 123 }))).toBeNull();
        });

        it('should return null when mealType is not a string', () => {
            expect(getBody(JSON.stringify({ date: "2026-03-30", recipeName: "Pasta", mealType: 123 }))).toBeNull();
        });

        it('should return null when imagePath is not a string', () => {
            expect(getBody(JSON.stringify({ date: "2026-03-30", recipeName: "Pasta", imagePath: 123 }))).toBeNull();
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
