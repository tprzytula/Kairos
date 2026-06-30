import { createBodyParser } from "@kairos-lambdas-libs/handler-factories";
import { IRequestBody, IRequestBodyItem } from "./types";

const MAX_BATCH_SIZE = 25;

const validateItem = (item: IRequestBodyItem) => {
  if (!item.name || !item.unit || !item.shopId) {
    return false;
  }

  if (item.quantity === undefined || item.quantity === null) {
    return false;
  }

  const quantity = Number(item.quantity);
  if (isNaN(quantity) || quantity <= 0) {
    return false;
  }

  return true;
};

const validateBody = (body: unknown): body is IRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const b = body as Record<string, unknown>;

  if (!Array.isArray(b.items) || b.items.length === 0) {
    return false;
  }

  if (b.items.length > MAX_BATCH_SIZE) {
    return false;
  }

  return b.items.every(validateItem);
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
