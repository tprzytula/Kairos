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

  if (b.date !== undefined && (typeof b.date !== 'string' || b.date.trim().length === 0)) {
    return false;
  }

  if (b.recipeName !== undefined && (typeof b.recipeName !== 'string' || b.recipeName.trim().length === 0)) {
    return false;
  }

  if (b.mealType !== undefined && b.mealType !== null && typeof b.mealType !== 'string') {
    return false;
  }

  if (b.imagePath !== undefined && b.imagePath !== null && typeof b.imagePath !== 'string') {
    return false;
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
