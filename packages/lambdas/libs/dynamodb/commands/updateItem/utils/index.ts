export const getUpdateExpression = (fields: Record<string, string | boolean>) => 
  `set ${Object.keys(fields).map(k => `#${k} = :${k}`).join(', ')}`;

export const getExpressionAttributeNames = (fields: Record<string, string | boolean>) => 
  Object.fromEntries(Object.keys(fields).map(k => [`#${k}`, k]));

export const getExpressionAttributeValues = (fields: Record<string, string | boolean>) => 
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [`:${k}`, v]));
