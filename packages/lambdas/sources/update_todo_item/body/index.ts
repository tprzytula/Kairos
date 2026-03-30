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

  const hasAtLeastOneField = b.name !== undefined ||
                           b.description !== undefined ||
                           b.dueDate !== undefined ||
                           b.isDone !== undefined ||
                           b.steps !== undefined;

  if (!hasAtLeastOneField) {
    return false;
  }

  if (b.name !== undefined && b.name !== null) {
    if (typeof b.name !== 'string' || b.name.trim().length === 0) {
      return false;
    }
  }

  if (b.description !== undefined && b.description !== null) {
    if (typeof b.description !== 'string') {
      return false;
    }
  }

  if (b.dueDate !== undefined && b.dueDate !== null) {
    if (typeof b.dueDate !== 'number' || b.dueDate < 0) {
      return false;
    }
  }

  if (b.isDone !== undefined && b.isDone !== null) {
    if (typeof b.isDone !== 'boolean') {
      return false;
    }
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
