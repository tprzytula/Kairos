export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface DeletePushSubscriptionResponse {
  success: boolean;
}

export interface SavePushSubscriptionResponse {
  success: boolean;
}
