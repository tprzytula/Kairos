import { GroceryItemUnit } from '@kairos/shared'

export { GroceryItemUnit } from '@kairos/shared'

export const GroceryItemUnitLabelMap: Record<GroceryItemUnit, string> = {
    [GroceryItemUnit.BAG]: 'bags',
    [GroceryItemUnit.BOTTLE]: 'bottles',
    [GroceryItemUnit.BOX]: 'boxes',
    [GroceryItemUnit.CAN]: 'cans',
    [GroceryItemUnit.GRAM]: 'grams',
    [GroceryItemUnit.KILOGRAM]: 'kilograms',
    [GroceryItemUnit.LITER]: 'liters',
    [GroceryItemUnit.MILLILITER]: 'milliliters',
    [GroceryItemUnit.ROLL]: 'rolls',
    [GroceryItemUnit.UNIT]: 'units',
}
