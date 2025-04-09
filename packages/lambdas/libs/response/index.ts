import {
  CreateBodyFn,
  CreateResponseFn,
  ICreateResponseParams,
  ITemplates,
} from "./types";

const TEMPLATES: ITemplates = {
  200: "OK",
  400: "Bad Request",
  500: "Internal Server Error",
};

const createBody: CreateBodyFn = (statusCode, message) => {
  if (typeof message === "string") {
    return message;
  }

  if (message) {
    return JSON.stringify(message);
  }

  if (statusCode in TEMPLATES) {
    return TEMPLATES[statusCode];
  }

  return "No response";
};

export const createResponse: CreateResponseFn = ({
  statusCode = 200,
  message,
}: ICreateResponseParams) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: createBody(statusCode, message),
  };
};
