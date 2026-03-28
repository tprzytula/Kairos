export const filterPrivateItems = <T extends { visibility?: string; ownerId?: string }>(
  items: T[],
  userId: string
): T[] => {
  return items.filter(item => {
    if (item.visibility === 'private') {
      return item.ownerId === userId;
    }
    return true;
  });
};
