export const logResponse = (items: Array<Record<string, unknown>>) => {
  console.info("Returning items", {
    count: items.length,
    items: JSON.stringify(items),
  });
};

export const sortItems = (items: Array<Record<string, number>>) => {
  return items.sort((a, b) => a.timestamp - b.timestamp);
};
