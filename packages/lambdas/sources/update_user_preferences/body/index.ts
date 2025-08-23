import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody): boolean => {
  // currentProjectId is optional, but if provided, must be a string
  if (body.currentProjectId !== undefined && body.currentProjectId !== null) {
    if (typeof body.currentProjectId !== 'string' || body.currentProjectId.trim().length === 0) {
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
