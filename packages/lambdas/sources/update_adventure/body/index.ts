import { IRequestBody } from "./types";

const validateBody = (body: any): body is IRequestBody => {
  if (!body.id || typeof body.id !== 'string') {
    return false;
  }

  if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length === 0)) {
    return false;
  }

  if (body.date !== undefined && (typeof body.date !== 'string' || body.date.trim().length === 0)) {
    return false;
  }

  if (body.time !== undefined && body.time !== null && typeof body.time !== 'string') {
    return false;
  }

  if (body.endTime !== undefined && body.endTime !== null && typeof body.endTime !== 'string') {
    return false;
  }

  if (body.location !== undefined && body.location !== null && typeof body.location !== 'string') {
    return false;
  }

  if (body.notes !== undefined && body.notes !== null && typeof body.notes !== 'string') {
    return false;
  }

  if (body.endDate !== undefined && body.endDate !== null && typeof body.endDate !== 'string') {
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
