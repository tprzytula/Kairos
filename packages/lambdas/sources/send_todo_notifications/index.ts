import { SNSEvent, Handler } from "aws-lambda";
import { createResponse } from "@kairos-lambdas-libs/response";
import { DynamoDBTable, DynamoDBIndex, query, getItem } from "@kairos-lambdas-libs/dynamodb";
import * as webPush from "web-push";
import { 
  TodoNotificationMessage, 
  PushSubscription, 
  ProjectMember, 
  Project, 
  WebPushPayload, 
  NotificationResponse 
} from "./types";

export const handler: Handler<SNSEvent> = async (event) => {
  try {
    for (const record of event.Records) {
      const message: TodoNotificationMessage = JSON.parse(record.Sns.Message);
      const { projectId, todoItem, authorId, authorName } = message;

      const [projectMembers, project] = await Promise.all([
        getProjectMembers(projectId),
        getProject(projectId)
      ]);

      const recipients = projectMembers.filter(member => member.userId !== authorId);

      for (const member of recipients) {
        const pushSubscriptions = await getUserPushSubscriptions(member.userId);
        
        for (const subscription of pushSubscriptions) {
          const payload: WebPushPayload = {
            title: `New todo in ${project?.name || 'your project'}`,
            body: `${authorName || 'Someone'} added: ${todoItem.name}`,
            data: { 
              projectId, 
              todoId: todoItem.id,
              type: 'todo_added'
            }
          };
          
          await sendWebPushNotification(subscription, payload);
        }
      }
    }

    const response: NotificationResponse = {
      statusCode: 200,
      message: "Notifications sent successfully"
    };

    return createResponse(response);
  } catch (error) {
    console.error("Failed to send todo notifications:", error);
    
    const errorResponse: NotificationResponse = {
      statusCode: 500,
      message: "Failed to send notifications"
    };

    return createResponse(errorResponse);
  }
};

const getProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
  const members = await query({
    tableName: DynamoDBTable.PROJECT_MEMBERS,
    indexName: DynamoDBIndex.PROJECT_MEMBERS_PROJECT,
    attributes: {
      projectId,
    },
  });
  
  return members;
};

const getProject = async (projectId: string): Promise<Project | null> => {
  try {
    const project = await getItem<Project>({
      tableName: DynamoDBTable.PROJECTS,
      item: {
        id: projectId,
      },
    });
    
    return project;
  } catch {
    return null;
  }
};

const getUserPushSubscriptions = async (userId: string): Promise<PushSubscription[]> => {
  try {
    const subscriptions = await query({
      tableName: DynamoDBTable.PUSH_SUBSCRIPTIONS,
      indexName: DynamoDBIndex.PUSH_SUBSCRIPTIONS_USER,
      attributes: {
        userId,
      },
    });
    
    return subscriptions;
  } catch {
    return [];
  }
};

const sendWebPushNotification = async (
  subscription: PushSubscription, 
  payload: WebPushPayload
): Promise<void> => {
  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI-4MuU9wSZVAQ';
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 'your-vapid-private-key';
    
    webPush.setVapidDetails(
      'mailto:your-email@domain.com',
      vapidPublicKey,
      vapidPrivateKey
    );

    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };

    console.log(`Sending notification to ${subscription.endpoint}`, payload);
    
    const result = await webPush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );
    
    console.log('Push notification sent successfully:', result);
  } catch (error) {
    console.error("Failed to send web push notification:", error);
    if (error.statusCode === 410) {
      console.log(`Subscription ${subscription.endpoint} is no longer valid`);
    }
  }
};
