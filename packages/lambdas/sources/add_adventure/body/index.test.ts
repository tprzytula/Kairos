import { getBody } from ".";

describe('Given the getBody function for add_adventure', () => {
    describe('When the body is valid', () => {
        it('should return the body with required fields', () => {
            const body = getBody(JSON.stringify({ name: "Beach Trip", date: "2026-06-15" }));

            expect(body).toEqual({ name: "Beach Trip", date: "2026-06-15" });
        });

        it('should return the body with optional fields', () => {
            const input = {
                name: "Beach Trip",
                date: "2026-06-15",
                time: "10:00",
                location: "Beach",
                notes: "Fun day",
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

        it('should return null when name is missing', () => {
            expect(getBody(JSON.stringify({ date: "2026-06-15" }))).toBeNull();
        });

        it('should return null when name is empty', () => {
            expect(getBody(JSON.stringify({ name: "", date: "2026-06-15" }))).toBeNull();
        });

        it('should return null when name is only whitespace', () => {
            expect(getBody(JSON.stringify({ name: "   ", date: "2026-06-15" }))).toBeNull();
        });

        it('should return null when date is missing', () => {
            expect(getBody(JSON.stringify({ name: "Trip" }))).toBeNull();
        });

        it('should return null when date is empty', () => {
            expect(getBody(JSON.stringify({ name: "Trip", date: "" }))).toBeNull();
        });

        it('should return null when time is not a string', () => {
            expect(getBody(JSON.stringify({ name: "Trip", date: "2026-06-15", time: 123 }))).toBeNull();
        });

        it('should return null when location is not a string', () => {
            expect(getBody(JSON.stringify({ name: "Trip", date: "2026-06-15", location: 123 }))).toBeNull();
        });

        it('should return null when notes is not a string', () => {
            expect(getBody(JSON.stringify({ name: "Trip", date: "2026-06-15", notes: 123 }))).toBeNull();
        });

        it('should return null when imagePath is not a string', () => {
            expect(getBody(JSON.stringify({ name: "Trip", date: "2026-06-15", imagePath: 123 }))).toBeNull();
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
