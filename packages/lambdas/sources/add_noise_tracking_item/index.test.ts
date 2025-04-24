import { DynamoDBTable } from "@kairos-lambdas-libs/dynamodb";
import { putItem } from "@kairos-lambdas-libs/dynamodb";
import { handler } from "./index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    putItem: jest.fn(),
}));

describe('Given the add_noise_tracking_item lambda handler', () => {
        it('should add the item in the noise tracking table', async () => {
            await runHandler();

            expect(jest.mocked(putItem)).toHaveBeenCalledWith({
                tableName: DynamoDBTable.NOISE_TRACKING,
                item: {
                    timestamp: expect.any(Number),
                },
            });
        });

        describe('And the putItem succeeds', () => {
            it('should return status 201', async () => {
                const result = await runHandler();

                expect(result.statusCode).toBe(201);
            });
        });

        describe('And the putItem fails', () => {
            it('should return status 500', async () => {
                jest.mocked(putItem).mockRejectedValue(new Error('PutItem failed'));

                const result = await runHandler();

                expect(result.statusCode).toBe(500);
            });
        });
});

const runHandler = async () => {
    return await handler({} as any, {} as any, {} as any);
}