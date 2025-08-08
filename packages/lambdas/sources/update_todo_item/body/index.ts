import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody) => {
  if (!body.id) {
    return false;
  }

  const hasAtLeastOneField = body.name !== undefined || 
                           body.description !== undefined || 
                           body.dueDate !== undefined || 
                           body.isDone !== undefined;
  
  if (!hasAtLeastOneField) {
    return false;
  }

  if (body.name !== undefined && body.name !== null) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      return false;
    }
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== 'string') {
      return false;
    }
  }

  if (body.dueDate !== undefined && body.dueDate !== null) {
    if (typeof body.dueDate !== 'number' || body.dueDate < 0) {
      return false;
    }
  }

  if (body.isDone !== undefined && body.isDone !== null) {
    if (typeof body.isDone !== 'boolean') {
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