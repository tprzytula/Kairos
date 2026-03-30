import { createBodyParser } from "@kairos-lambdas-libs/handler-factories";
import { IRequestBody } from "./types";

const validateBody = (body: unknown): body is IRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const b = body as Record<string, unknown>;

  if (!b.name) {
    return false;
  }
  if (typeof b.month !== "number" || b.month < 1 || b.month > 12) {
    return false;
  }
  if (typeof b.day !== "number" || b.day < 1 || b.day > 31) {
    return false;
  }
  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
