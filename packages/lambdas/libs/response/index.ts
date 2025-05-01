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
  },
  body: createBody({
    statusCode,
    message,
  }),
});
