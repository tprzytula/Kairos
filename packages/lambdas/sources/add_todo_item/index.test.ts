import { getBody } from "./body";
import { handler } from "./index";
import { IRequestBody } from "./body/types";
import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";

jest.mock('node:crypto', () => ({
    randomUUID: jest.fn(),
}));

jest.mock('./body', () => ({
    getBody: jest.fn(),
}));

jest.mock('@kairos-lambdas-libs/dynamodb', () => ({
    ...jest.requireActual('@kairos-lambdas-libs/dynamodb'),
    putItem: jest.fn(),
}));

describe('Given the add_todo_item lambda handler', () => {
    describe('When the body is invalid', () => {
        it('should return status 400', async () => {
            jest.mocked(getBody).mockReturnValue(null);

            const result = await runHandler({ body: null });

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the body is valid', () => {
        it('should upsert the item in the todo list table', async () => {
            jest.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
            jest.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);

            await runHandler({ body: JSON.stringify(EXAMPLE_TODO_ITEM) });

            expect(jest.mocked(putItem)).toHaveBeenCalledWith({
                tableName: DynamoDBTable.TODO_LIST,
                item: {
                    id: EXAMPLE_ID,
                    isDone: false,
                    ...EXAMPLE_TODO_ITEM,
                },
            });
        });

        describe('And the upsert succeeds', () => {
            it('should return status 201', async () => {
                jest.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                jest.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
                jest.mocked(putItem).mockResolvedValue({
                    $metadata: {
                        httpStatusCode: 201,
                    },
                });

                const result = await runHandler({ body: JSON.stringify(EXAMPLE_TODO_ITEM) });

                expect(result.statusCode).toBe(201);
                expect(result.body).toEqual(JSON.stringify({ id: EXAMPLE_ID }));
            });
        });

        describe('And the upsert fails', () => {
            it('should return status 500', async () => {
                jest.mocked(putItem).mockRejectedValue(new Error('Upsert failed'));

                const result = await runHandler({ body: JSON.stringify(EXAMPLE_TODO_ITEM) });

                expect(result.statusCode).toBe(500);
            });
        });
    });
});

const EXAMPLE_ID = "11111111-1111-1111-1111-111111111111";  

const EXAMPLE_TODO_ITEM: IRequestBody = {
    name: "Wash dishes",
    description: "Wash the dishes before going to bed",
    dueDate: 1714329600,
}

interface IAPIGatewayProxyEvent {
    body: string | null;
}

const runHandler = async ({ body }: IAPIGatewayProxyEvent) => {
    return await handler({ body } as any, {} as any, {} as any);
}