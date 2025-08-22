import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody) => {
  if (!body.name || !body.unit) {
    return false;
  }

  if (body.quantity === undefined || body.quantity === null) {
    return false;
  }

  const quantity = Number(body.quantity);
  if (isNaN(quantity) || quantity < 1) {
    return false;
  }

  return true;
};

export const getBody = (body: string | null): IRequestBody | null => {
  if (!body) {
    return null;
  } 

  try {
    const parsedBody = JSON.parse(body);
    const isValid = validateBody(parsedBody);

    if (isValid) {
      return parsedBody;
    }
  } catch (error) {
    console.error('Failed to parse body:', error);
  }

  return null;
};
