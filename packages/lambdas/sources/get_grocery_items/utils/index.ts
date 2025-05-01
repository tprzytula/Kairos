import { GroceryItem } from '../parser/types';

export const logResponse = (items: Array<GroceryItem>) => {
  console.info('Returning items', {
    count: items.length,
    items: JSON.stringify(items),
  });
};
