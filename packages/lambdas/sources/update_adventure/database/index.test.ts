import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { updateAdventure } from ".";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    updateItem: vi.fn(),
}));

describe('Given the updateAdventure database function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should always include updatedAt', async () => {
        await updateAdventure("adv-1", {});

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.ADVENTURES,
            key: { id: "adv-1" },
            updatedFields: {
                updatedAt: expect.any(String),
            },
        });
    });

    it('should include name when provided and trim it', async () => {
        await updateAdventure("adv-1", { name: "  Updated  " });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.ADVENTURES,
            key: { id: "adv-1" },
            updatedFields: expect.objectContaining({
                name: "Updated",
            }),
        });
    });

    it('should include date when provided and trim it', async () => {
        await updateAdventure("adv-1", { date: "  2026-07-01  " });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.ADVENTURES,
            key: { id: "adv-1" },
            updatedFields: expect.objectContaining({
                date: "2026-07-01",
            }),
        });
    });

    it('should set nullable fields to null when empty', async () => {
        await updateAdventure("adv-1", {
            endDate: null,
            time: null,
            location: null,
            notes: null,
            imagePath: null,
        });

        expect(DynamoDB.updateItem).toHaveBeenCalledWith({
            tableName: DynamoDBTable.ADVENTURES,
            key: { id: "adv-1" },
            updatedFields: expect.objectContaining({
                endDate: null,
                time: null,
                location: null,
                notes: null,
                imagePath: null,
            }),
        });
    });

    it('should not include fields that are not provided', async () => {
        await updateAdventure("adv-1", { name: "Updated" });

        const call = vi.mocked(DynamoDB.updateItem).mock.calls[0][0];
        expect(call.updatedFields).not.toHaveProperty('date');
        expect(call.updatedFields).not.toHaveProperty('endDate');
        expect(call.updatedFields).not.toHaveProperty('time');
        expect(call.updatedFields).not.toHaveProperty('location');
        expect(call.updatedFields).not.toHaveProperty('notes');
        expect(call.updatedFields).not.toHaveProperty('imagePath');
    });
});
