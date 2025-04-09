type Message = string | { [key: string]: any };

export interface ICreateResponseParams {
  statusCode?: number;
  message?: Message;
}

export interface ICreateResponseResult {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  body: string;
}
