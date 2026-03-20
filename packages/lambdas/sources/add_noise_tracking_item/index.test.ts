import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
    ...(await vi.importActual("@kairos-lambdas-libs/dynamodb")),
    putItem: vi.fn(),
}));

describe('Given the add_noise_tracking_item lambda handler', () => {
    it('should require project ID', async () => {
        const result = await runHandler();

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    it('should add the item in the noise tracking table', async () => {
        await runHandler(createMockEvent());

        expect(vi.mocked(DynamoDB.putItem)).toHaveBeenCalledWith({
            tableName: DynamoDBTable.NOISE_TRACKING,
            item: {
                projectId: "test-project",
                timestamp: expect.any(Number),
            },
        });
    });

    describe('And the putItem succeeds', () => {
        it('should return status 201', async () => {
            const result = await runHandler(createMockEvent());

            expect(result.statusCode).toBe(201);
        });
    });

    describe('And the putItem fails', () => {
        it('should return status 500', async () => {
            vi.mocked(DynamoDB.putItem).mockRejectedValue(new Error('PutItem failed'));

            const result = await runHandler(createMockEvent());

            expect(result.statusCode).toBe(500);
        });
    });
});

const createMockEvent = (projectId: string = "test-project") => ({
    headers: {
        "X-Project-ID": projectId,
    },
} as any);

const runHandler = async (event: any = {}) => {
    return await handler(event, {} as any, {} as any);
}