vi.mock('web-push', async () => ({
  setVapidDetails: vi.fn(),
  sendNotification: vi.fn(),
}));

import { handler } from "./index";
import { query, getItem } from "@kairos-lambdas-libs/dynamodb";
import * as webPush from 'web-push';

vi.mock('@kairos-lambdas-libs/dynamodb', async () => ({
  DynamoDBTable: {
    PROJECT_MEMBERS: 'ProjectMembers',
    PROJECTS: 'Projects',
    PUSH_SUBSCRIPTIONS: 'PushSubscriptions'
  },
  DynamoDBIndex: {
    PROJECT_MEMBERS_PROJECT: 'ProjectMembersIndex',
    PUSH_SUBSCRIPTIONS_USER: 'UserPushSubscriptionsIndex'
  },
  query: vi.fn(),
  getItem: vi.fn()
}));

const mockQuery = vi.mocked(query);
const mockGetItem = vi.mocked(getItem);
const mockSendNotification = vi.mocked(webPush.sendNotification);

describe('send_todo_notifications Lambda', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    it("should use fallback project name when getProject throws an error", async () => {
      const notificationMessage = {
        projectId: mockProjectId,
        todoItem: mockTodoItem,
        authorId: mockAuthorId,
        authorName: 'John Doe'
      };

      const mockProjectMembers = [
        { userId: "member-1", projectId: mockProjectId, role: "member" }
      ];

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

      mockGetItem.mockRejectedValueOnce(new Error("Project not found"));

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(mockSendNotification).toHaveBeenCalledWith(
        {
          endpoint: "https://push.service.com/endpoint-1",
          keys: { p256dh: "key1", auth: "auth1" },
        },
        JSON.stringify({
          title: "New todo in your project",
          body: "John Doe added: Test Todo Item",
          data: {
            projectId: mockProjectId,
            todoId: mockTodoItem.id,
            type: "todo_added"
          }
        })
      );
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

    it("should return empty array when getUserPushSubscriptions query fails", async () => {
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
        .mockRejectedValueOnce(new Error("Push subscription query failed"));

      mockGetItem.mockResolvedValueOnce(mockProject);

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(mockSendNotification).not.toHaveBeenCalled();
    });

    it("should throw when VAPID keys are not configured", async () => {
      delete process.env.VAPID_PUBLIC_KEY;
      delete process.env.VAPID_PRIVATE_KEY;

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

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to send web push notification:",
        expect.objectContaining({ message: 'VAPID keys are not configured in environment variables' })
      );

      consoleSpy.mockRestore();
    });

    it("should handle expired push subscriptions (410 status)", async () => {
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

      const pushError = new Error("Gone") as any;
      pushError.statusCode = 410;
      mockSendNotification.mockRejectedValueOnce(pushError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(logSpy).toHaveBeenCalledWith(
        "Subscription https://push.service.com/endpoint-1 is no longer valid"
      );

      consoleSpy.mockRestore();
      logSpy.mockRestore();
    });

    it("should handle push subscription errors with other status codes", async () => {
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

      const pushError = new Error("Internal Server Error") as any;
      pushError.statusCode = 500;
      mockSendNotification.mockRejectedValueOnce(pushError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to send web push notification:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
      logSpy.mockRestore();
    });

    it("should handle not found push subscriptions (404 status)", async () => {
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

      const pushError = new Error("Not Found") as any;
      pushError.statusCode = 404;
      mockSendNotification.mockRejectedValueOnce(pushError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const event = createSNSEvent(notificationMessage);

      const response = await handler(event, {} as any, {} as any);
      expect(response.statusCode).toBe(200);
      expect(logSpy).toHaveBeenCalledWith(
        "Subscription https://push.service.com/endpoint-1 is no longer valid"
      );

      consoleSpy.mockRestore();
      logSpy.mockRestore();
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