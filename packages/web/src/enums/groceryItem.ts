export enum GroceryItemUnit {
    BAG = 'bag(s)',
    BOTTLE = 'bottle(s)',
    BOX = 'box(es)',
    CAN = 'can(s)',
    GRAM = 'g',
    KILOGRAM = 'kg',
    LITER = 'l',
    MILLILITER = 'ml',
    UNIT = 'unit(s)',
}

export const GroceryItemUnitLabelMap = {
    [GroceryItemUnit.BAG]: 'bags',
    [GroceryItemUnit.BOTTLE]: 'bottles',
    [GroceryItemUnit.BOX]: 'boxes',
    [GroceryItemUnit.CAN]: 'cans',
    [GroceryItemUnit.GRAM]: 'grams',
    [GroceryItemUnit.KILOGRAM]: 'kilograms',
    [GroceryItemUnit.LITER]: 'liters',
    [GroceryItemUnit.MILLILITER]: 'milliliters',
    [GroceryItemUnit.UNIT]: 'units',
}
