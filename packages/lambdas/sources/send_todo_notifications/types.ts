export interface TodoNotificationMessage {
  projectId: string;
  todoItem: {
    id: string;
    name: string;
    description?: string;
  };
  authorId: string;
  authorName?: string;
}

export interface PushSubscription {
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface ProjectMember {
  userId: string;
  projectId: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
}

export interface WebPushPayload {
  title: string;
  body: string;
  data: Record<string, unknown>;
}

export interface NotificationResponse {
  statusCode: number;
  message: string;
}
