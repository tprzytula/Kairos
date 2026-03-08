export interface IStep {
  id: string;
  name: string;
  isDone: boolean;
}

export interface TodoItem {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate?: number;
  isDone: boolean;
  steps?: IStep[];
}

export interface TodoItemForNotification {
  id: string;
  name: string;
  description?: string;
}

export interface TodoNotificationPayload {
  projectId: string;
  todoItem: TodoItemForNotification;
  authorId: string;
  authorName: string;
}

export interface CreateTodoResponse {
  id: string;
}
