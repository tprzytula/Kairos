import { createBodyParser } from "@kairos-lambdas-libs/handler-factories";
import { IRequestBody } from "./types";

const validateBody = (body: unknown): body is IRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const b = body as Record<string, unknown>;

  if (!b.name || typeof b.name !== 'string' || b.name.trim().length === 0) {
    return false;
  }

  if (!b.date || typeof b.date !== 'string' || b.date.trim().length === 0) {
    return false;
  }

  if (b.time !== undefined && typeof b.time !== 'string') {
    return false;
  }

  if (b.endTime !== undefined && typeof b.endTime !== 'string') {
    return false;
  }

  if (b.location !== undefined && typeof b.location !== 'string') {
    return false;
  }

  if (b.notes !== undefined && typeof b.notes !== 'string') {
    return false;
  }

  if (b.imagePath !== undefined && typeof b.imagePath !== 'string') {
    return false;
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
