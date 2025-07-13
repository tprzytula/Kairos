import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody) => {
  if (!body.id || !body.quantity) {
    return false;
  }

  const quantity = parseInt(body.quantity, 10);
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