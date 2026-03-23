import { IRequestBody } from "./types";

const validateBody = (body: any): body is IRequestBody => {
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return false;
  }

  if (!body.date || typeof body.date !== 'string' || body.date.trim().length === 0) {
    return false;
  }

  if (body.time !== undefined && typeof body.time !== 'string') {
    return false;
  }

  if (body.location !== undefined && typeof body.location !== 'string') {
    return false;
  }

  if (body.notes !== undefined && typeof body.notes !== 'string') {
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
