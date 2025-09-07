import { IRequestBody } from "./types";

const validateBody = (body: any): body is IRequestBody => {
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return false;
  }

  if (body.icon !== undefined && (typeof body.icon !== 'string' || body.icon.trim().length === 0)) {
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
    const isValid = validateBody(parsedBody);

    if (isValid) {
      return parsedBody;
    }
  } catch (error) {
    console.error('Failed to parse body:', error);
  }

  return null;
};
