import { ICreateBodyParams, ITemplates } from "./types";
import { ResponseStatusCodes } from "../enums";

const TEMPLATES: ITemplates = {
  [ResponseStatusCodes.OK]: "OK",
  [ResponseStatusCodes.CREATED]: "Created",
  [ResponseStatusCodes.BAD_REQUEST]: "Bad Request",
  [ResponseStatusCodes.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};

export const createBody = ({
  statusCode,
  message,
}: ICreateBodyParams): string => {
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
