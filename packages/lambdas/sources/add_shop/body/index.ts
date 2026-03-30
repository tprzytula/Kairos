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

  if (b.icon !== undefined && (typeof b.icon !== 'string' || b.icon.trim().length === 0)) {
    return false;
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
