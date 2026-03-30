import { createBodyParser } from "@kairos-lambdas-libs/handler-factories";
import { IRequestBody } from "./types";

const validateBody = (body: unknown): body is IRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const b = body as Record<string, unknown>;

  if (!b.id) {
    return false;
  }

  const hasAtLeastOneField = b.quantity !== undefined ||
                           b.name !== undefined ||
                           b.unit !== undefined ||
                           b.shopId !== undefined ||
                           b.imagePath !== undefined;

  if (!hasAtLeastOneField) {
    return false;
  }

  if (b.quantity !== undefined && b.quantity !== null) {
    if (typeof b.quantity !== 'string') {
      return false;
    }
    const quantity = Number(b.quantity);
    if (isNaN(quantity) || quantity < 1) {
      return false;
    }
  }

  if (b.name !== undefined && b.name !== null) {
    if (typeof b.name !== 'string' || b.name.trim().length === 0) {
      return false;
    }
  }

  if (b.imagePath !== undefined && b.imagePath !== null) {
    if (typeof b.imagePath !== 'string') {
      return false;
    }
  }

  if (b.shopId !== undefined && b.shopId !== null) {
    if (typeof b.shopId !== 'string' || b.shopId.trim().length === 0) {
      return false;
    }
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
