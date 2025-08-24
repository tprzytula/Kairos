export interface TodoItem {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate?: number;
  isDone: boolean;
  [key: string]: string | number | boolean | undefined;
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
