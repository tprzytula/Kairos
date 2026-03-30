import { getBody } from ".";

describe('Given the getBody function for add_birthday', () => {
    describe('When the body is valid', () => {
        it('should return the body with required fields', () => {
            const body = getBody(JSON.stringify({ name: "John", month: 3, day: 15 }));

            expect(body).toEqual({ name: "John", month: 3, day: 15 });
        });

        it('should return the body with optional fields', () => {
            const input = { name: "John", month: 3, day: 15, birthYear: 1990, notes: "Likes cake" };
            const body = getBody(JSON.stringify(input));

            expect(body).toEqual(input);
        });
    });

    describe('When the body is invalid', () => {
        it('should return null when body is null', () => {
            expect(getBody(null)).toBeNull();
        });

        it('should return null when name is missing', () => {
            expect(getBody(JSON.stringify({ month: 3, day: 15 }))).toBeNull();
        });

        it('should return null when month is missing', () => {
            expect(getBody(JSON.stringify({ name: "John", day: 15 }))).toBeNull();
        });

        it('should return null when day is missing', () => {
            expect(getBody(JSON.stringify({ name: "John", month: 3 }))).toBeNull();
        });

        it('should return null when month is less than 1', () => {
            expect(getBody(JSON.stringify({ name: "John", month: 0, day: 15 }))).toBeNull();
        });

        it('should return null when month is greater than 12', () => {
            expect(getBody(JSON.stringify({ name: "John", month: 13, day: 15 }))).toBeNull();
        });

        it('should return null when day is less than 1', () => {
            expect(getBody(JSON.stringify({ name: "John", month: 3, day: 0 }))).toBeNull();
        });

        it('should return null when day is greater than 31', () => {
            expect(getBody(JSON.stringify({ name: "John", month: 3, day: 32 }))).toBeNull();
        });

        it('should return null when month is not a number', () => {
            expect(getBody(JSON.stringify({ name: "John", month: "March", day: 15 }))).toBeNull();
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
