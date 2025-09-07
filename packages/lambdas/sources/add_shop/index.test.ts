import { handler } from "./index";
import * as database from "./database";

jest.mock("./database");

describe('Given the add_shop lambda handler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should require project ID', async () => {
        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should require request body', async () => {
        const event = {
            headers: { "X-Project-ID": "test-project" },
            body: null,
        } as any;

        const result = await handler(event, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    it('should require valid request body', async () => {
        const event = {
            headers: { "X-Project-ID": "test-project" },
            body: JSON.stringify({}),
        } as any;

        const result = await handler(event, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
    });

    describe('When creating a new shop', () => {
        it('should call upsertItem with correct parameters', async () => {
            const mockUpsertItem = jest.spyOn(database, 'upsertItem').mockResolvedValue({
                id: "new-shop-id",
                statusCode: 201,
            });

            const event = {
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    name: "New Shop",
                    icon: "/assets/icons/shop.png",
                }),
            } as any;

            await handler(event, {} as any, {} as any);

            expect(mockUpsertItem).toHaveBeenCalledWith({
                projectId: "test-project",
                name: "New Shop",
                icon: "/assets/icons/shop.png",
            });
        });

        it('should return status 201 with shop id', async () => {
            jest.spyOn(database, 'upsertItem').mockResolvedValue({
                id: "new-shop-id",
                statusCode: 201,
            });

            const event = {
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    name: "New Shop",
                }),
            } as any;

            const result = await handler(event, {} as any, {} as any);

            expect(result.statusCode).toBe(201);
            expect(result.body).toBe(JSON.stringify({ id: "new-shop-id" }));
        });
    });

    describe('When shop name already exists', () => {
        it('should return status 409', async () => {
            jest.spyOn(database, 'upsertItem').mockResolvedValue({
                id: "existing-shop-id",
                statusCode: 409,
            });

            const event = {
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    name: "Existing Shop",
                }),
            } as any;

            const result = await handler(event, {} as any, {} as any);

            expect(result.statusCode).toBe(409);
            expect(result.body).toBe(JSON.stringify({ id: "existing-shop-id" }));
        });
    });

    describe('When database operation fails', () => {
        it('should return status 500', async () => {
            jest.spyOn(database, 'upsertItem').mockRejectedValue(new Error('Database error'));

            const event = {
                headers: { "X-Project-ID": "test-project" },
                body: JSON.stringify({
                    name: "Test Shop",
                }),
            } as any;

            const result = await handler(event, {} as any, {} as any);

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
