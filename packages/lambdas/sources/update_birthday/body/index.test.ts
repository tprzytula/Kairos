import { getBody } from ".";

describe('Given the getBody function for update_birthday', () => {
    describe('When the body is valid', () => {
        it('should return the body with id only', () => {
            const body = getBody(JSON.stringify({ id: "bday-1" }));

            expect(body).toEqual({ id: "bday-1" });
        });

        it('should return the body with optional fields', () => {
            const input = {
                id: "bday-1",
                name: "Jane",
                month: 6,
                day: 20,
                birthYear: 1995,
                notes: "Gift ideas",
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
            expect(getBody(JSON.stringify({ name: "Jane" }))).toBeNull();
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
