import { ICreateResponseParams, ICreateResponseResult } from "./types";
import { ResponseStatusCodes } from "./enums";
import { createBody } from "./messageBody";

export const createResponse = ({
  statusCode = ResponseStatusCodes.OK,
  message,
}: ICreateResponseParams): ICreateResponseResult => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
  body: createBody({
    statusCode,
    message,
  }),
});
