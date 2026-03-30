import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { createAdventure } from ".";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    putItem: vi.fn(),
}));

vi.mock("node:crypto", () => ({
    randomUUID: () => "test-uuid",
}));

describe('Given the createAdventure database function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create an adventure with required fields', async () => {
        const id = await createAdventure({
            projectId: "test-project",
            name: "Beach Trip",
            date: "2026-06-15",
        });

        expect(id).toBe("test-uuid");
        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.ADVENTURES,
            item: expect.objectContaining({
                id: "test-uuid",
                projectId: "test-project",
                name: "Beach Trip",
                date: "2026-06-15",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }),
        });
    });

    it('should trim string values', async () => {
        await createAdventure({
            projectId: "test-project",
            name: "  Beach Trip  ",
            date: "  2026-06-15  ",
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.ADVENTURES,
            item: expect.objectContaining({
                name: "Beach Trip",
                date: "2026-06-15",
            }),
        });
    });

    it('should include optional fields when provided', async () => {
        await createAdventure({
            projectId: "test-project",
            name: "Trip",
            date: "2026-06-15",
            endDate: "2026-06-16",
            time: "10:00",
            location: "Beach",
            notes: "Fun",
            imagePath: "/img.jpg",
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.ADVENTURES,
            item: expect.objectContaining({
                endDate: "2026-06-16",
                time: "10:00",
                location: "Beach",
                notes: "Fun",
                imagePath: "/img.jpg",
            }),
        });
    });

    it('should not include optional fields when not provided', async () => {
        await createAdventure({
            projectId: "test-project",
            name: "Trip",
            date: "2026-06-15",
        });

        const call = vi.mocked(DynamoDB.putItem).mock.calls[0][0];
        expect(call.item).not.toHaveProperty('endDate');
        expect(call.item).not.toHaveProperty('time');
        expect(call.item).not.toHaveProperty('location');
        expect(call.item).not.toHaveProperty('notes');
        expect(call.item).not.toHaveProperty('imagePath');
    });

    it('should set visibility to private when isPrivate is true', async () => {
        await createAdventure({
            projectId: "test-project",
            name: "Trip",
            date: "2026-06-15",
            isPrivate: true,
            userId: "user-1",
        });

        expect(DynamoDB.putItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.ADVENTURES,
            item: expect.objectContaining({
                visibility: "private",
                ownerId: "user-1",
            }),
        });
    });
});
