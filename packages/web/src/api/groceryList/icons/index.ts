import { GROCERY_LIST_API_URL } from '..'
import { IGroceryItemIcon } from './types';

export const retrieveGroceryListIcons = async (): Promise<Array<IGroceryItemIcon>> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items_icons`)

  if (response.ok) {
    const icons: Array<IGroceryItemIcon> = await response.json();

    return icons;
  }

  return [];
}
