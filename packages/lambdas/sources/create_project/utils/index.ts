import { randomBytes } from "crypto";

const MAX_PROJECTS = 5;

export const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomBytesArray = randomBytes(6);
  
  return Array.from(randomBytesArray).reduce((result, byte) => 
    result + chars[byte % chars.length], ''
  );
};

export const validateProjectLimit = async (currentProjectCount: number): Promise<boolean> => {
  return currentProjectCount < MAX_PROJECTS;
};
