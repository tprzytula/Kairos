import { IRequestBody } from "./types";

const validateBody = (body: IRequestBody) => {
  if (!body.id) {
    return false;
  }

  const hasAtLeastOneField = body.quantity !== undefined || 
                           body.name !== undefined || 
                           body.unit !== undefined || 
                           body.shopId !== undefined ||
                           body.imagePath !== undefined;
  
  if (!hasAtLeastOneField) {
    return false;
  }

  if (body.quantity !== undefined && body.quantity !== null) {
    if (typeof body.quantity !== 'string') {
      return false;
    }
    const quantity = Number(body.quantity);
    if (isNaN(quantity) || quantity < 1) {
      return false;
    }
  }

  if (body.name !== undefined && body.name !== null) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      return false;
    }
  }

  if (body.imagePath !== undefined && body.imagePath !== null) {
    if (typeof body.imagePath !== 'string') {
      return false;
    }
  }

  if (body.shopId !== undefined && body.shopId !== null) {
    if (typeof body.shopId !== 'string' || body.shopId.trim().length === 0) {
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