import { createBodyParser } from "@kairos-lambdas-libs/handler-factories";
import { IRequestBody } from "./types";

const validateBody = (body: unknown): body is IRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const b = body as Record<string, unknown>;

  if (!b.id || typeof b.id !== 'string') {
    return false;
  }

  if (b.name !== undefined && (typeof b.name !== 'string' || b.name.trim().length === 0)) {
    return false;
  }

  if (b.date !== undefined && (typeof b.date !== 'string' || b.date.trim().length === 0)) {
    return false;
  }

  if (b.time !== undefined && b.time !== null && typeof b.time !== 'string') {
    return false;
  }

  if (b.endTime !== undefined && b.endTime !== null && typeof b.endTime !== 'string') {
    return false;
  }

  if (b.location !== undefined && b.location !== null && typeof b.location !== 'string') {
    return false;
  }

  if (b.notes !== undefined && b.notes !== null && typeof b.notes !== 'string') {
    return false;
  }

  if (b.endDate !== undefined && b.endDate !== null && typeof b.endDate !== 'string') {
    return false;
  }

  if (b.imagePath !== undefined && b.imagePath !== null && typeof b.imagePath !== 'string') {
    return false;
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
