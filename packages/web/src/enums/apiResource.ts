export enum ApiEndpoint {
  ADVENTURES = 'adventures',
  BIRTHDAYS = 'birthdays/items',
  GROCERY_LIST = 'grocery_list',
  GROCERY_ITEM_DEFAULTS = 'grocery_list/items_defaults',
  MEAL_PLANS = 'meal-plans',
  OFFICE_ATTENDANCE = 'office-attendance',
  RECIPES = 'recipes',
  SHOPS = 'shops',
}

export const ApiResourceName: Record<string, string> = {
  [ApiEndpoint.ADVENTURES]: 'adventure',
  [ApiEndpoint.BIRTHDAYS]: 'birthday',
  [ApiEndpoint.GROCERY_LIST]: 'grocery list',
  [ApiEndpoint.GROCERY_ITEM_DEFAULTS]: 'grocery item default',
  [ApiEndpoint.MEAL_PLANS]: 'meal plan',
  [ApiEndpoint.OFFICE_ATTENDANCE]: 'office attendance',
  [ApiEndpoint.RECIPES]: 'recipe',
  [ApiEndpoint.SHOPS]: 'shop',
}
