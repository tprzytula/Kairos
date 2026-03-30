import { getBody } from ".";

describe('Given the getBody function for update_meal_plan', () => {
    describe('When the body is valid', () => {
        it('should return the body with id only', () => {
            const body = getBody(JSON.stringify({ id: "mp-1" }));

            expect(body).toEqual({ id: "mp-1" });
        });

        it('should return the body with optional fields', () => {
            const input = {
                id: "mp-1",
                date: "2026-04-01",
                recipeName: "Pasta",
                mealType: "dinner",
                imagePath: "/img.jpg",
            };
            const body = getBody(JSON.stringify(input));

            expect(body).toEqual(input);
        });

        it('should allow null for nullable fields', () => {
            const input = {
                id: "mp-1",
                mealType: null,
                imagePath: null,
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
            expect(getBody(JSON.stringify({ date: "2026-04-01" }))).toBeNull();
        });

        it('should return null when id is not a string', () => {
            expect(getBody(JSON.stringify({ id: 123 }))).toBeNull();
        });

        it('should return null when date is empty', () => {
            expect(getBody(JSON.stringify({ id: "mp-1", date: "" }))).toBeNull();
        });

        it('should return null when recipeName is empty', () => {
            expect(getBody(JSON.stringify({ id: "mp-1", recipeName: "" }))).toBeNull();
        });

        it('should return null when mealType is not a string or null', () => {
            expect(getBody(JSON.stringify({ id: "mp-1", mealType: 123 }))).toBeNull();
        });

        it('should return null when imagePath is not a string or null', () => {
            expect(getBody(JSON.stringify({ id: "mp-1", imagePath: 123 }))).toBeNull();
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
