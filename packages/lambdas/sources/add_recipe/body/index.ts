import { createBodyParser } from "@kairos-lambdas-libs/handler-factories";
import { IRequestBody, IRecipeIngredientBody } from "./types";

const isValidIngredient = (ingredient: any): ingredient is IRecipeIngredientBody => {
  return (
    ingredient &&
    typeof ingredient.name === 'string' && ingredient.name.trim().length > 0 &&
    typeof ingredient.quantity === 'number' && ingredient.quantity > 0 &&
    typeof ingredient.unit === 'string' && ingredient.unit.trim().length > 0
  );
};

const validateBody = (body: unknown): body is IRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const b = body as Record<string, unknown>;

  if (!b.name || typeof b.name !== 'string' || b.name.trim().length === 0) {
    return false;
  }

  if (!Array.isArray(b.ingredients) || b.ingredients.length === 0) {
    return false;
  }

  if (!b.ingredients.every(isValidIngredient)) {
    return false;
  }

  return true;
};

export const getBody = createBodyParser<IRequestBody>(validateBody);
