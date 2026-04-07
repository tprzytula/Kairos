import { createBodyParser } from "@kairos-lambdas-libs/handler-factories";
import { IRequestBody } from "./types";

const validateBody = (body: unknown): body is IRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const b = body as Record<string, unknown>;

  if (!b.date || typeof b.date !== 'string' || b.date.trim().length === 0) {
    return false;
  }

  if (!b.userId || typeof b.userId !== 'string' || b.userId.trim().length === 0) {
    return false;
  }

  if (!b.userName || typeof b.userName !== 'string' || b.userName.trim().length === 0) {
    return false;
  }

  if (b.userAvatar !== undefined && typeof b.userAvatar !== 'string') {
    return false;
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
