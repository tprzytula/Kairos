import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody) => {
  if (!body.id) {
    return false;
  }

  const hasAtLeastOneField = body.name !== undefined || body.icon !== undefined;
  
  if (!hasAtLeastOneField) {
    return false;
  }

  if (body.name !== undefined && body.name !== null) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      return false;
    }
  }

  if (body.icon !== undefined && body.icon !== null) {
    if (typeof body.icon !== 'string' || body.icon.trim().length === 0) {
      return false;
    }
  }

  return true;
};

export const getBody = (rawBody: string | null): IRequestBody | null => {
  if (!rawBody) {
    return null;
  }

  try {
    const body = JSON.parse(rawBody);
    
    if (!validateBody(body)) {
      return null;
    }

    return body;
  } catch {
    return null;
  }
};
