import { getBody } from "./body";
import { handler } from "./index";
import { IRequestBody } from "./body/types";
import { DynamoDBTable, updateItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";

jest.mock('node:crypto', () => ({
    randomUUID: jest.fn(),
}));

jest.mock('./body', () => ({
    getBody: jest.fn(),
}));

jest.mock('@kairos-lambdas-libs/dynamodb', () => ({
    ...jest.requireActual('@kairos-lambdas-libs/dynamodb'),
    updateItem: jest.fn(),
}));

describe('Given the update_todo_item_status lambda handler', () => {
    describe('When the body is invalid', () => {
        it('should return status 400', async () => {
            jest.mocked(getBody).mockReturnValue(null);

            const result = await runHandler({ body: null, pathParameters: { id: EXAMPLE_ID } });

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the body is valid', () => {
        it('should update the item in the todo list table', async () => {
            jest.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
            jest.mocked(getBody).mockReturnValue(EXAMPLE_UPDATE_TODO_ITEM_STATUS_BODY);

            await runHandler(EXAMPLE_REQUEST);

            expect(jest.mocked(updateItem)).toHaveBeenCalledWith({
                tableName: DynamoDBTable.TODO_LIST,
                key: {
                    id: EXAMPLE_ID,
                },
                updatedFields: {
                    isDone: false,
                },
            });
        });

        describe('And the upsert succeeds', () => {
            it('should return status 200', async () => {
                jest.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                jest.mocked(getBody).mockReturnValue(EXAMPLE_UPDATE_TODO_ITEM_STATUS_BODY);
                jest.mocked(updateItem).mockResolvedValue({
                    $metadata: {
                        httpStatusCode: 200,
                    },
                });

                const result = await runHandler(EXAMPLE_REQUEST);

                expect(result.statusCode).toBe(200);
                expect(result.body).toEqual(JSON.stringify({ id: EXAMPLE_ID }));
            });
        });

        describe('And the upsert fails', () => {
            it('should return status 500', async () => {
                jest.mocked(updateItem).mockRejectedValue(new Error('Update failed'));

                const result = await runHandler(EXAMPLE_REQUEST)

                expect(result.statusCode).toBe(500);
            });
        });
    });
});

const EXAMPLE_ID = "11111111-1111-1111-1111-111111111111";  

const EXAMPLE_UPDATE_TODO_ITEM_STATUS_BODY: IRequestBody = {
    isDone: false,
}

const EXAMPLE_REQUEST = {
    body: JSON.stringify(EXAMPLE_UPDATE_TODO_ITEM_STATUS_BODY),
    pathParameters: {
        id: EXAMPLE_ID,
    },
}

interface IAPIGatewayProxyEvent {
    body: string | null;
    pathParameters: {
        id: string;
    }
}

const runHandler = async ({ body, pathParameters }: IAPIGatewayProxyEvent) => {
    return await handler({ body, pathParameters } as any, {} as any, {} as any);
}