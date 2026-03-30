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

  if (!b.recipeName || typeof b.recipeName !== 'string' || b.recipeName.trim().length === 0) {
    return false;
  }

  if (b.recipeId !== undefined && typeof b.recipeId !== 'string') {
    return false;
  }

  if (b.mealType !== undefined && typeof b.mealType !== 'string') {
    return false;
  }

  if (b.imagePath !== undefined && typeof b.imagePath !== 'string') {
    return false;
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
