import { getBody } from ".";

describe('Given the getBody function for update_adventure', () => {
    describe('When the body is valid', () => {
        it('should return the body with id only', () => {
            const body = getBody(JSON.stringify({ id: "adv-1" }));

            expect(body).toEqual({ id: "adv-1" });
        });

        it('should return the body with optional fields', () => {
            const input = {
                id: "adv-1",
                name: "Updated",
                date: "2026-07-01",
                endDate: "2026-07-02",
                time: "14:00",
                location: "Mountain",
                notes: "Great trip",
                imagePath: "/img.jpg",
            };
            const body = getBody(JSON.stringify(input));

            expect(body).toEqual(input);
        });

        it('should allow null for nullable fields', () => {
            const input = {
                id: "adv-1",
                time: null,
                location: null,
                notes: null,
                endDate: null,
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
            expect(getBody(JSON.stringify({ name: "Updated" }))).toBeNull();
        });

        it('should return null when id is not a string', () => {
            expect(getBody(JSON.stringify({ id: 123 }))).toBeNull();
        });

        it('should return null when name is empty', () => {
            expect(getBody(JSON.stringify({ id: "adv-1", name: "" }))).toBeNull();
        });

        it('should return null when name is only whitespace', () => {
            expect(getBody(JSON.stringify({ id: "adv-1", name: "   " }))).toBeNull();
        });

        it('should return null when date is empty', () => {
            expect(getBody(JSON.stringify({ id: "adv-1", date: "" }))).toBeNull();
        });

        it('should return null when time is not a string or null', () => {
            expect(getBody(JSON.stringify({ id: "adv-1", time: 123 }))).toBeNull();
        });

        it('should return null when location is not a string or null', () => {
            expect(getBody(JSON.stringify({ id: "adv-1", location: 123 }))).toBeNull();
        });

        it('should return null when notes is not a string or null', () => {
            expect(getBody(JSON.stringify({ id: "adv-1", notes: 123 }))).toBeNull();
        });

        it('should return null when endDate is not a string or null', () => {
            expect(getBody(JSON.stringify({ id: "adv-1", endDate: 123 }))).toBeNull();
        });

        it('should return null when imagePath is not a string or null', () => {
            expect(getBody(JSON.stringify({ id: "adv-1", imagePath: 123 }))).toBeNull();
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
