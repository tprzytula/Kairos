import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware";
import { createResponse } from "@kairos-lambdas-libs/response";
import { getBody } from "./body";
import { DynamoDBTable, putItem } from "@kairos-lambdas-libs/dynamodb";
import { randomUUID } from "node:crypto";
import { SNS } from "aws-sdk";
import { 
  TodoItem, 
  TodoNotificationPayload, 
  CreateTodoResponse 
} from "./types";

const sns = new SNS();

export const handler: Handler<APIGatewayProxyEvent> = middleware(
  async (event: AuthenticatedEvent) => {
    const { projectId, userId, user } = event;
    
    if (!userId) {
      return createResponse({
        statusCode: 401,
        message: "User authentication required",
      });
    }

    if (!projectId) {
      return createResponse({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    const body = getBody(event.body);
    
    if (!body) {
      return createResponse({
        statusCode: 400,
      });
    }

    const { name, description, dueDate } = body; 
    const id = randomUUID();

    const todoItem: TodoItem = {
      id,
      projectId,
      name,
      description,
      dueDate,
      isDone: false,
    };

    await putItem({
      tableName: DynamoDBTable.TODO_LIST,
      item: todoItem,
    });

    try {
      await publishTodoNotification({
        projectId,
        todoItem: { id, name, description },
        authorId: userId,
        authorName: user?.given_name || user?.name || user?.email || "Someone"
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }

    const response: CreateTodoResponse = {
      id,
    };

    return createResponse({
      statusCode: 201,
      message: response,
    });
  },
);

const publishTodoNotification = async (payload: TodoNotificationPayload): Promise<void> => {
  const topicArn = process.env.TODO_NOTIFICATIONS_TOPIC_ARN;
  
  if (!topicArn) {
    console.warn("TODO_NOTIFICATIONS_TOPIC_ARN environment variable not set");
    return;
  }

  const publishParams = {
    TopicArn: topicArn,
    Message: JSON.stringify(payload),
    Subject: `New todo item added: ${payload.todoItem.name}`
  };

  await sns.publish(publishParams).promise();
};
