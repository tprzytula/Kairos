import { handler } from "./index";
import * as database from "./database";

vi.mock("./database");

describe('Given the update_adventure lambda handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should require request body', async () => {
        const result = await handler({
            headers: { "X-Project-ID": "test-project" },
            body: null,
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should require valid request body', async () => {
        const result = await handler({
            headers: { "X-Project-ID": "test-project" },
            body: JSON.stringify({}),
        } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    describe('When updating an adventure', () => {
        it('should call updateAdventure with correct parameters', async () => {
            vi.mocked(database.updateAdventure).mockResolvedValue();

            await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    id: "adv-1",
                    name: "Updated Trip",
                    date: "2026-07-01",
                    time: "14:00",
                    location: "Mountain",
                }),
            } as any, {} as any, {} as any);

            expect(database.updateAdventure).toHaveBeenCalledWith("adv-1", {
                name: "Updated Trip",
                date: "2026-07-01",
                time: "14:00",
                location: "Mountain",
                endDate: undefined,
                notes: undefined,
                imagePath: undefined,
            });
        });

        it('should return status 200 with adventure id', async () => {
            vi.mocked(database.updateAdventure).mockResolvedValue();

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({ id: "adv-1", name: "Updated" }),
            } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(200);
            expect(result.body).toBe(JSON.stringify({ id: "adv-1" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            vi.mocked(database.updateAdventure).mockRejectedValue(new Error('DB error'));

            const result = await handler({
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({ id: "adv-1", name: "Updated" }),
            } as any, {} as any, {} as any);

            expect(result).toEqual({
                body: "Internal Server Error",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },
                statusCode: 500,
            });
        });
    });
});
