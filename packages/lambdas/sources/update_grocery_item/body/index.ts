import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody) => {
  if (!body.id || body.quantity === undefined || body.quantity === null) {
    return false;
  }

  const quantity = Number(body.quantity);
  if (isNaN(quantity) || quantity < 1) {
    return false;
  }

  return true;
};

export const getBody = (rawBody: string | null): IRequestBody | null => {
  if (!rawBody) {
    return null;
  }

  try {
    const body = JSON.parse(rawBody);
    
    if (!validateBody(body)) {
      return null;
    }

    return body;
  } catch {
    return null;
  }
}; 