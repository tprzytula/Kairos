import { jest } from '@jest/globals';
import type { IRequestBody } from './body/types';

const mockPromise = jest.fn().mockResolvedValue({ MessageId: 'test-message-id' });
const mockSNSPublish = jest.fn().mockReturnValue({
    promise: mockPromise
});

jest.mock('aws-sdk', () => ({
    SNS: jest.fn().mockImplementation(() => ({
        publish: mockSNSPublish
    }))
}));

import { handler } from './index';
import { getBody } from './body';
import { DynamoDBTable, putItem } from '@kairos-lambdas-libs/dynamodb';
import { randomUUID } from 'node:crypto';

jest.mock('./body', () => ({
    getBody: jest.fn()
}));

jest.mock('@kairos-lambdas-libs/dynamodb', () => ({
    DynamoDBTable: {
        TODO_LIST: 'TodoList'
    },
    putItem: jest.fn()
}));

jest.mock('node:crypto', () => ({
    randomUUID: jest.fn()
}));

describe('Given the add_todo_item lambda handler', () => {
    beforeEach(() => {
        process.env.TODO_NOTIFICATIONS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:test-topic';
        jest.clearAllMocks();
    });

    afterEach(() => {
        delete process.env.TODO_NOTIFICATIONS_TOPIC_ARN;
    });

    it('should require authentication first', async () => {
        const result = await runHandler({ body: null });

        expect(result.statusCode).toBe(401);
        expect(result.body).toBe("User authentication required");
    });

    it('should require project ID when authenticated', async () => {
        const result = await runHandler({ body: null }, false, true);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Project ID is required");
    });

    describe('When the body is invalid', () => {
        it('should return status 400', async () => {
            jest.mocked(getBody).mockReturnValue(null);

            const result = await runHandler({ body: null }, true, true);

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the body is valid', () => {
        it('should upsert the item in the todo list table', async () => {
            jest.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
            jest.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);

            await runHandler({ body: JSON.stringify(EXAMPLE_TODO_ITEM) }, true, true);

            expect(jest.mocked(putItem)).toHaveBeenCalledWith({
                tableName: DynamoDBTable.TODO_LIST,
                item: {
                    id: EXAMPLE_ID,
                    projectId: "test-project",
                    isDone: false,
                    ...EXAMPLE_TODO_ITEM,
                },
            });
        });

        describe('And the upsert succeeds', () => {
            it('should return status 201 and send notification', async () => {
                jest.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                jest.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
                jest.mocked(putItem).mockResolvedValue({
                    $metadata: {
                        httpStatusCode: 201,
                    },
                });

                const result = await runHandler({ 
                    body: JSON.stringify(EXAMPLE_TODO_ITEM)
                }, true, true);

                expect(result.statusCode).toBe(201);
                expect(JSON.parse(result.body)).toEqual({ id: EXAMPLE_ID });

                expect(mockSNSPublish).toHaveBeenCalledWith({
                    TopicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
                    Message: JSON.stringify({
                        projectId: 'test-project',
                        todoItem: {
                            id: EXAMPLE_ID,
                            name: EXAMPLE_TODO_ITEM.name,
                            description: EXAMPLE_TODO_ITEM.description
                        },
                        authorId: 'test-user-id',
                        authorName: 'John'
                    }),
                    Subject: `New todo item added: ${EXAMPLE_TODO_ITEM.name}`
                });
            });

            it('should continue if notification fails', async () => {
                const mockFailedPromise = jest.fn().mockRejectedValue(new Error('SNS failed'));
                mockSNSPublish.mockReturnValueOnce({
                    promise: mockFailedPromise
                });

                jest.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                jest.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
                jest.mocked(putItem).mockResolvedValue({
                    $metadata: {
                        httpStatusCode: 201,
                    },
                });

                const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

                const result = await runHandler({ 
                    body: JSON.stringify(EXAMPLE_TODO_ITEM)
                }, true, true);

                expect(result.statusCode).toBe(201);
                expect(mockConsoleError).toHaveBeenCalledWith('Failed to send notification:', expect.any(Error));
                
                mockConsoleError.mockRestore();
            });

            it('should fallback to email when given_name is not available', async () => {
                jest.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                jest.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
                jest.mocked(putItem).mockResolvedValue({
                    $metadata: {
                        httpStatusCode: 201,
                    },
                });

                const result = await runHandler({ 
                    body: JSON.stringify(EXAMPLE_TODO_ITEM)
                }, true, true, { useEmailOnly: true });

                expect(result.statusCode).toBe(201);

                expect(mockSNSPublish).toHaveBeenCalledWith({
                    TopicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
                    Message: JSON.stringify({
                        projectId: 'test-project',
                        todoItem: {
                            id: EXAMPLE_ID,
                            name: EXAMPLE_TODO_ITEM.name,
                            description: EXAMPLE_TODO_ITEM.description
                        },
                        authorId: 'test-user-id',
                        authorName: 'test-user@example.com'
                    }),
                    Subject: `New todo item added: ${EXAMPLE_TODO_ITEM.name}`
                });
            });
        });

        describe('And the upsert fails', () => {
            it('should return status 500', async () => {
                jest.mocked(putItem).mockRejectedValue(new Error('Upsert failed'));

                const result = await runHandler({ 
                    body: JSON.stringify(EXAMPLE_TODO_ITEM)
                }, true, true);

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

const runHandler = async (
    { body }: IAPIGatewayProxyEvent,
    includeProjectId: boolean = false,
    includeUserInfo: boolean = false,
    options: { useEmailOnly?: boolean } = {}
) => {
    const event = { body } as any;
    if (includeProjectId) {
        event.headers = { "X-Project-ID": "test-project" };
    }
    if (includeUserInfo) {
        event.requestContext = {
            authorizer: {
                claims: {
                    sub: "test-user-id",
                    ...(options.useEmailOnly ? {} : { given_name: "John" }),
                    email: "test-user@example.com"
                }
            }
        };
    }
    return await handler(event, {} as any, {} as any);
}