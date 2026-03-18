import { IRequestBody, IRequestBodyItem } from "./types";

const MAX_BATCH_SIZE = 25;

const validateItem = (item: IRequestBodyItem) => {
  if (!item.name || !item.unit || !item.shopId || !item.imagePath) {
    return false;
  }

  if (item.quantity === undefined || item.quantity === null) {
    return false;
  }

  const quantity = Number(item.quantity);
  if (isNaN(quantity) || quantity < 1) {
    return false;
  }

  return true;
};

const validateBody = (body: IRequestBody) => {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return false;
  }

  if (body.items.length > MAX_BATCH_SIZE) {
    return false;
  }

  return body.items.every(validateItem);
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
