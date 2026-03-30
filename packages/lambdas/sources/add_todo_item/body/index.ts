import { createBodyParser } from "@kairos-lambdas-libs/handler-factories";
import { IRequestBody } from "./types";

const validateBody = (body: unknown): body is IRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const b = body as Record<string, unknown>;

  console.debug('Validating body', b);
  if (!b.name) {
    return false;
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
