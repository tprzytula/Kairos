import { GroceryItemUnit } from '../../enums/groceryItem';

export interface IItemDefault {
  name: string;
  unit?: GroceryItemUnit;
  icon?: string;
  category?: string;
}

export interface IUseItemDefaultsProps {
  fetchMethod: () => Promise<Array<IItemDefault>>;
}

export interface IUseItemDefaultsResult {
  defaults: Array<IItemDefault>;
}
