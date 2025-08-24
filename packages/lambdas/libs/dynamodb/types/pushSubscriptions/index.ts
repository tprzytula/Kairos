export interface IPushSubscription {
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: number;
  [key: string]: string | number | boolean | undefined | { p256dh: string; auth: string; };
}
