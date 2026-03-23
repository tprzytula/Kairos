import { IRequestBody } from "./types";

const validateBody = (body: any): body is IRequestBody => {
  if (!body.date || typeof body.date !== 'string' || body.date.trim().length === 0) {
    return false;
  }

  if (!body.recipeName || typeof body.recipeName !== 'string' || body.recipeName.trim().length === 0) {
    return false;
  }

  if (body.recipeId !== undefined && typeof body.recipeId !== 'string') {
    return false;
  }

  if (body.mealType !== undefined && typeof body.mealType !== 'string') {
    return false;
  }

  if (body.imagePath !== undefined && typeof body.imagePath !== 'string') {
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
