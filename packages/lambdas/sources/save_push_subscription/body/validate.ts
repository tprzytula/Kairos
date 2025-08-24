import { IRequestBody } from "./types";

export const validateBody = (body: unknown): body is IRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const candidate = body as Record<string, unknown>;

  if (typeof candidate.endpoint !== 'string' || !candidate.endpoint.trim()) {
    return false;
  }

  if (!candidate.keys || typeof candidate.keys !== 'object') {
    return false;
  }

  const keys = candidate.keys as Record<string, unknown>;
  
  if (typeof keys.p256dh !== 'string' || !keys.p256dh.trim()) {
    return false;
  }

  if (typeof keys.auth !== 'string' || !keys.auth.trim()) {
    return false;
  }

  return true;
};
