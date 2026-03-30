import { Mock } from 'vitest';
import type { IRequestBody } from './body/types';

vi.mock('aws-sdk', () => {
    const mockPublish = vi.fn().mockReturnValue({
        promise: vi.fn().mockResolvedValue({ MessageId: 'test-message-id' }),
    });
    class MockSNS {
        publish = mockPublish;
    }
    return {
        SNS: MockSNS,
        __mocks: { publish: mockPublish },
    };
});

import { handler } from './index';
import { getBody } from './body';
import { DynamoDBTable, putItem } from '@kairos-lambdas-libs/dynamodb';
import { randomUUID } from 'node:crypto';

const { __mocks } = await import('aws-sdk') as unknown as { __mocks: { publish: Mock } };
const mockSNSPublish: Mock = __mocks.publish;

vi.mock('./body', async () => ({
    getBody: vi.fn()
}));

vi.mock('@kairos-lambdas-libs/dynamodb', async () => ({
    DynamoDBTable: {
        TODO_LIST: 'TodoList'
    },
    putItem: vi.fn()
}));

vi.mock('node:crypto', async () => ({
    randomUUID: vi.fn()
}));

describe('Given the add_todo_item lambda handler', () => {
    beforeEach(() => {
        process.env.TODO_NOTIFICATIONS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:test-topic';
        vi.clearAllMocks();
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
            vi.mocked(getBody).mockReturnValue(null);

            const result = await runHandler({ body: null }, true, true);

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the body is valid', () => {
        it('should upsert the item in the todo list table', async () => {
            vi.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
            vi.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);

            await runHandler({ body: JSON.stringify(EXAMPLE_TODO_ITEM) }, true, true);

            expect(vi.mocked(putItem)).toHaveBeenCalledWith({
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
                vi.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                vi.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
                vi.mocked(putItem).mockResolvedValue({
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
                const mockFailedPromise = vi.fn().mockRejectedValue(new Error('SNS failed'));
                mockSNSPublish.mockReturnValueOnce({
                    promise: mockFailedPromise
                });

                vi.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                vi.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
                vi.mocked(putItem).mockResolvedValue({
                    $metadata: {
                        httpStatusCode: 201,
                    },
                });

                const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

                const result = await runHandler({ 
                    body: JSON.stringify(EXAMPLE_TODO_ITEM)
                }, true, true);

                expect(result.statusCode).toBe(201);
                expect(mockConsoleError).toHaveBeenCalledWith('Failed to send notification:', expect.any(Error));
                
                mockConsoleError.mockRestore();
            });

            it('should fallback to name when given_name is not available', async () => {
                vi.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                vi.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
                vi.mocked(putItem).mockResolvedValue({
                    $metadata: {
                        httpStatusCode: 201,
                    },
                });

                const result = await runHandler({
                    body: JSON.stringify(EXAMPLE_TODO_ITEM)
                }, true, true, { useNameOnly: true });

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
                        authorName: 'John Doe'
                    }),
                    Subject: `New todo item added: ${EXAMPLE_TODO_ITEM.name}`
                });
            });

            it('should fallback to "Someone" when no user info is available', async () => {
                vi.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                vi.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
                vi.mocked(putItem).mockResolvedValue({
                    $metadata: {
                        httpStatusCode: 201,
                    },
                });

                const result = await runHandler({
                    body: JSON.stringify(EXAMPLE_TODO_ITEM)
                }, true, true, { useNoUserInfo: true });

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
                        authorName: 'Someone'
                    }),
                    Subject: `New todo item added: ${EXAMPLE_TODO_ITEM.name}`
                });
            });

            it('should fallback to email when given_name is not available', async () => {
                vi.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
                vi.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
                vi.mocked(putItem).mockResolvedValue({
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
                vi.mocked(putItem).mockRejectedValue(new Error('Upsert failed'));

                const result = await runHandler({
                    body: JSON.stringify(EXAMPLE_TODO_ITEM)
                }, true, true);

                expect(result.statusCode).toBe(500);
            });
        });
    });

    describe('When TOPIC_ARN is not set', () => {
        it('should not attempt to publish and still return 201', async () => {
            delete process.env.TODO_NOTIFICATIONS_TOPIC_ARN;

            vi.mocked(randomUUID).mockReturnValue(EXAMPLE_ID);
            vi.mocked(getBody).mockReturnValue(EXAMPLE_TODO_ITEM);
            vi.mocked(putItem).mockResolvedValue({
                $metadata: { httpStatusCode: 201 },
            });

            const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            const result = await runHandler({
                body: JSON.stringify(EXAMPLE_TODO_ITEM)
            }, true, true);

            expect(result.statusCode).toBe(201);
            expect(mockSNSPublish).not.toHaveBeenCalled();
            expect(mockConsoleWarn).toHaveBeenCalledWith('TODO_NOTIFICATIONS_TOPIC_ARN environment variable not set');

            mockConsoleWarn.mockRestore();
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
    options: { useEmailOnly?: boolean; useNameOnly?: boolean; useNoUserInfo?: boolean } = {}
) => {
    const event = { body } as any;
    if (includeProjectId) {
        event.headers = { "X-Project-ID": "test-project" };
    }
    if (includeUserInfo) {
        const claims: Record<string, string> = {
            sub: "test-user-id",
        };
        if (options.useNoUserInfo) {
            // No name or email fields
        } else if (options.useEmailOnly) {
            claims.email = "test-user@example.com";
        } else if (options.useNameOnly) {
            claims.name = "John Doe";
        } else {
            claims.given_name = "John";
            claims.email = "test-user@example.com";
        }
        event.requestContext = {
            authorizer: {
                claims
            }
        };
    }
    return await handler(event, {} as any, {} as any);
}