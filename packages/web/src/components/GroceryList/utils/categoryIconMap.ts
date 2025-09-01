import { GroceryCategory } from '../../../enums/groceryCategory';
import { SectionIcon } from '../../CollapsibleSection/types';

export const CATEGORY_ICON_MAP: Record<GroceryCategory, SectionIcon> = {
  [GroceryCategory.PRODUCE]: { emoji: '🥬', backgroundColor: '#ecfdf5', foregroundColor: '#047857' },
  [GroceryCategory.DAIRY]: { emoji: '🧀', backgroundColor: '#fff7ed', foregroundColor: '#9a3412' },
  [GroceryCategory.MEAT]: { emoji: '🥩', backgroundColor: '#fef2f2', foregroundColor: '#991b1b' },
  [GroceryCategory.FROZEN]: { emoji: '🧊', backgroundColor: '#eff6ff', foregroundColor: '#1d4ed8' },
  [GroceryCategory.BAKERY]: { emoji: '🥖', backgroundColor: '#fffbeb', foregroundColor: '#92400e' },
  [GroceryCategory.PANTRY]: { emoji: '🫘', backgroundColor: '#faf5ff', foregroundColor: '#7e22ce' },
  [GroceryCategory.BEVERAGES]: { emoji: '🧃', backgroundColor: '#f0f9ff', foregroundColor: '#0c4a6e' },
  [GroceryCategory.HOUSEHOLD]: { emoji: '🧻', backgroundColor: '#f8fafc', foregroundColor: '#0f172a' },
  [GroceryCategory.OTHER]: { emoji: '🧺', backgroundColor: '#f4f4f5', foregroundColor: '#374151' },
};
