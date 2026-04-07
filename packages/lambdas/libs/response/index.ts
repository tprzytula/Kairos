import { ICreateResponseParams, ICreateResponseResult } from "./types";
import { ResponseStatusCodes } from "./enums";
import { createBody } from "./messageBody";

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
};

export const createResponse = ({
  statusCode = ResponseStatusCodes.OK,
  message,
}: ICreateResponseParams): ICreateResponseResult => ({
  statusCode,
  headers: CORS_HEADERS,
  body: createBody({
    statusCode,
    message,
  }),
});
