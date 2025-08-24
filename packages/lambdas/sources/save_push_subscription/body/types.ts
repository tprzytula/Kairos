export interface IRequestBody {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
