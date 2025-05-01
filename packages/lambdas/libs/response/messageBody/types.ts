export interface ITemplates {
  [code: number]: string;
}

type Message = string | { [key: string]: any };

export interface ICreateBodyParams {
  statusCode: number;
  message?: Message;
}
