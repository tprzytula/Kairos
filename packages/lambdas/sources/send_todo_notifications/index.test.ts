import { jest } from "@jest/globals";

const mockSendNotification = jest.fn();
jest.mock('web-push', () => ({
  setVapidDetails: jest.fn(),
  sendNotification: mockSendNotification
}));

import { handler } from "./index";
import { query, getItem } from "@kairos-lambdas-libs/dynamodb";

jest.mock('@kairos-lambdas-libs/dynamodb', () => ({
  DynamoDBTable: {
    PROJECT_MEMBERS: 'ProjectMembers',
    PROJECTS: 'Projects',
    PUSH_SUBSCRIPTIONS: 'PushSubscriptions'
  },
  DynamoDBIndex: {
    PROJECT_MEMBERS_PROJECT: 'ProjectMembersIndex',
    PUSH_SUBSCRIPTIONS_USER: 'UserPushSubscriptionsIndex'
  },
  query: jest.fn(),
  getItem: jest.fn()
}));

const mockQuery = jest.mocked(query);
const mockGetItem = jest.mocked(getItem);

describe('send_todo_notifications Lambda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockClear();
    mockGetItem.mockClear();
    mockSendNotification.mockClear();
    mockSendNotification.mockResolvedValue({ statusCode: 200 });
    
    process.env.VAPID_PUBLIC_KEY = 'test-public-key';
    process.env.VAPID_PRIVATE_KEY = 'test-private-key';
  });

  describe('when processing a todo notification message', () => {
    const mockProjectId = 'test-project-id';
    const mockAuthorId = 'author-123';
    const mockTodoItem = {
      id: 'todo-456',
      name: 'Test Todo Item',
      description: 'Test description'
    };

    it('should successfully send notifications to project members', async () => {
      const notificationMessage = {
        projectId: mockProjectId,
        todoItem: mockTodoItem,
        authorId: mockAuthorId,
        authorName: 'John Doe'
      };

      const mockProjectMembers = [
        { userId: mockAuthorId, projectId: mockProjectId, role: "owner" },
        { userId: "member-1", projectId: mockProjectId, role: "member" },
        { userId: "member-2", projectId: mockProjectId, role: "member" }
      ];

      const mockProject = {
        id: mockProjectId,
        name: "Test Project",
        ownerId: mockAuthorId
      };

      const mockPushSubscriptions = [
        {
          userId: "member-1",
          endpoint: "https://push.service.com/endpoint-1",
          keys: { p256dh: "key1", auth: "auth1" },
          createdAt: Date.now()
        }
      ];

      mockQuery
        .mockResolvedValueOnce(mockProjectMembers)
        .mockResolvedValueOnce(mockPushSubscriptions)
        .mockResolvedValueOnce([]);
      
      mockGetItem.mockResolvedValueOnce(mockProject);

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Notifications sent successfully");
      expect(mockQuery).toHaveBeenCalledTimes(3);
      expect(mockGetItem).toHaveBeenCalledTimes(1);
      expect(mockGetItem).toHaveBeenCalledWith({
        tableName: 'Projects',
        item: {
          id: mockProjectId
        }
      });
    });

    it("should filter out the author from recipients", async () => {
      const notificationMessage = {
        projectId: mockProjectId,
        todoItem: mockTodoItem,
        authorId: mockAuthorId,
        authorName: 'John Doe'
      };

      const mockProjectMembers = [
        { userId: mockAuthorId, projectId: mockProjectId, role: "owner" },
        { userId: "member-1", projectId: mockProjectId, role: "member" }
      ];

      const mockProject = {
        id: mockProjectId,
        name: "Test Project",
        ownerId: mockAuthorId
      };

      const mockPushSubscriptions = [
        {
          userId: "member-1",
          endpoint: "https://push.service.com/endpoint-1",
          keys: { p256dh: "key1", auth: "auth1" },
          createdAt: Date.now()
        }
      ];

      mockQuery
        .mockResolvedValueOnce(mockProjectMembers)
        .mockResolvedValueOnce(mockPushSubscriptions);
      
      mockGetItem.mockResolvedValueOnce(mockProject);

      const event = createSNSEvent(notificationMessage);

      await handler(event, {} as any, {} as any);
      expect(mockQuery).toHaveBeenCalledWith({
        tableName: 'PushSubscriptions',
        indexName: 'UserPushSubscriptionsIndex',
        attributes: {
          userId: 'member-1'
        }
      });

      expect(mockQuery).not.toHaveBeenCalledWith({
        tableName: 'PushSubscriptions',
        indexName: 'UserPushSubscriptionsIndex',
        attributes: {
          userId: mockAuthorId
        }
      });
    });

    it("should handle missing author name gracefully", async () => {
      const notificationMessage = {
        projectId: mockProjectId,
        todoItem: mockTodoItem,
        authorId: mockAuthorId
      };

      const mockProjectMembers = [
        { userId: "member-1", projectId: mockProjectId, role: "member" }
      ];

      const mockProject = {
        id: mockProjectId,
        name: "Test Project",
        ownerId: mockAuthorId
      };

      const mockPushSubscriptions = [
        {
          userId: "member-1",
          endpoint: "https://push.service.com/endpoint-1",
          keys: { p256dh: "key1", auth: "auth1" },
          createdAt: Date.now()
        }
      ];

      mockQuery
        .mockResolvedValueOnce(mockProjectMembers)
        .mockResolvedValueOnce(mockPushSubscriptions);
      
      mockGetItem.mockResolvedValueOnce(mockProject);

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);

      expect(response.statusCode).toBe(200);
    });

    it("should handle database errors gracefully", async () => {
      const notificationMessage = {
        projectId: mockProjectId,
        todoItem: mockTodoItem,
        authorId: mockAuthorId,
        authorName: 'John Doe'
      };

      mockQuery.mockRejectedValueOnce(new Error('Database error'));
      mockGetItem.mockResolvedValueOnce(null);

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(500);
      expect(response.body).toContain("Failed to send notifications");
    });

    it("should handle invalid SNS message format", async () => {
      const event = {
        Records: [{
          EventVersion: '1.0',
          EventSubscriptionArn: 'arn:aws:sns:us-east-1:123456789012:test-topic:subscription-id',
          EventSource: 'aws:sns',
          Sns: {
            Message: "invalid json",
            MessageId: 'test-message-id',
            Subject: 'Test Subject',
            Timestamp: '2023-01-01T00:00:00.000Z',
            TopicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
            Type: 'Notification',
            UnsubscribeUrl: 'https://sns.amazonaws.com',
            MessageAttributes: {},
            SignatureVersion: '1',
            Signature: 'test-signature',
            SigningCertUrl: 'https://sns.amazonaws.com/cert.pem'
          }
        }]
      };

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(500);
      expect(response.body).toContain("Failed to send notifications");
    });

    it("should handle projects with no members", async () => {
      const notificationMessage = {
        projectId: mockProjectId,
        todoItem: mockTodoItem,
        authorId: mockAuthorId,
        authorName: 'John Doe'
      };

      const mockProject = {
        id: mockProjectId,
        name: "Test Project",
        ownerId: mockAuthorId
      };

      mockQuery.mockResolvedValueOnce([]);
      mockGetItem.mockResolvedValueOnce(mockProject);

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Notifications sent successfully");
    });

    it("should handle members with no push subscriptions", async () => {
      const notificationMessage = {
        projectId: mockProjectId,
        todoItem: mockTodoItem,
        authorId: mockAuthorId,
        authorName: 'John Doe'
      };

      const mockProjectMembers = [
        { userId: "member-1", projectId: mockProjectId, role: "member" }
      ];

      const mockProject = {
        id: mockProjectId,
        name: "Test Project",
        ownerId: mockAuthorId
      };

      mockQuery
        .mockResolvedValueOnce(mockProjectMembers)
        .mockResolvedValueOnce([]);
      
      mockGetItem.mockResolvedValueOnce(mockProject);

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Notifications sent successfully");
    });
  });
});

function createSNSEvent(message: any) {
  return {
    Records: [{
      EventVersion: '1.0',
      EventSubscriptionArn: 'arn:aws:sns:us-east-1:123456789012:test-topic:subscription-id',
      EventSource: 'aws:sns',
      Sns: {
        Message: JSON.stringify(message),
        MessageId: 'test-message-id',
        Subject: 'Test Subject',
        Timestamp: '2023-01-01T00:00:00.000Z',
        TopicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
        Type: 'Notification',
        UnsubscribeUrl: 'https://sns.amazonaws.com',
        MessageAttributes: {},
        SignatureVersion: '1',
        Signature: 'test-signature',
        SigningCertUrl: 'https://sns.amazonaws.com/cert.pem'
      }
    }]
  };
}