import { IRequestBody, IRecipeIngredientBody } from "./types";

const isValidIngredient = (ingredient: any): ingredient is IRecipeIngredientBody => {
  return (
    ingredient &&
    typeof ingredient.name === 'string' && ingredient.name.trim().length > 0 &&
    typeof ingredient.quantity === 'number' && ingredient.quantity > 0 &&
    typeof ingredient.unit === 'string' && ingredient.unit.trim().length > 0
  );
};

const validateBody = (body: any): body is IRequestBody => {
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return false;
  }

  if (!Array.isArray(body.ingredients) || body.ingredients.length === 0) {
    return false;
  }

  if (!body.ingredients.every(isValidIngredient)) {
    return false;
  }

  return true;
};

export const getBody = (body: string | null): IRequestBody | null => {
  if (!body) {
    return null;
  }

  try {
    const parsedBody = JSON.parse(body);
    if (validateBody(parsedBody)) {
      return parsedBody;
    }
  } catch (error) {
    console.error('Failed to parse body:', error);
  }

  return null;
};
