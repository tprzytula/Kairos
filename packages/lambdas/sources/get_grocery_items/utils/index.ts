export const logResponse = (items: Array<Record<string, unknown>>) => {
  console.info("Returning items", {
    count: items.length,
    items: JSON.stringify(items),
  });
};
