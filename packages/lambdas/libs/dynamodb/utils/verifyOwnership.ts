export const verifyPrivateItemOwnership = (
  item: { visibility?: string; ownerId?: string },
  userId: string
): boolean => {
  if (item.visibility === 'private' && item.ownerId !== userId) {
    return false;
  }
  return true;
};
