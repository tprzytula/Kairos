import { IRequestBody } from "./types";

const validateBody = (body: any): body is IRequestBody => {
  if (!body.id || typeof body.id !== 'string') {
    return false;
  }

  if (body.date !== undefined && (typeof body.date !== 'string' || body.date.trim().length === 0)) {
    return false;
  }

  if (body.recipeName !== undefined && (typeof body.recipeName !== 'string' || body.recipeName.trim().length === 0)) {
    return false;
  }

  if (body.mealType !== undefined && body.mealType !== null && typeof body.mealType !== 'string') {
    return false;
  }

  if (body.imagePath !== undefined && body.imagePath !== null && typeof body.imagePath !== 'string') {
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
