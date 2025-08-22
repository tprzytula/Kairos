import { IJoinProjectRequestBody } from "./types";

const validateBody = (body: IJoinProjectRequestBody) => {
  if (!body.inviteCode || typeof body.inviteCode !== 'string') {
    return false;
  }

  // Invite codes should be 6 characters, alphanumeric
  const codeRegex = /^[A-Z0-9]{6}$/;
  if (!codeRegex.test(body.inviteCode)) {
    return false;
  }

  return true;
};

export const getBody = (body: string | null): IJoinProjectRequestBody | null => {
  if (!body) {
    return null;
  } 

  try {
    const parsedBody = JSON.parse(body);
    
    // Convert to uppercase before validation
    if (parsedBody.inviteCode && typeof parsedBody.inviteCode === 'string') {
      parsedBody.inviteCode = parsedBody.inviteCode.toUpperCase();
    }
    
    const isValid = validateBody(parsedBody);

    if (isValid) {
      return {
        inviteCode: parsedBody.inviteCode,
      };
    }
  } catch (error) {
    console.error('Failed to parse body:', error);
  }

  return null;
};
