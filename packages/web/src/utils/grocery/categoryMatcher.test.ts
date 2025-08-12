import { getCategoryFromName, getCategoryFromItemOrDefault } from './categoryMatcher'
import { GroceryCategory } from '../../enums/groceryCategory'

describe('categoryMatcher', () => {
  describe('getCategoryFromName', () => {
    it('should categorize produce items correctly', () => {
      expect(getCategoryFromName('Apple')).toBe(GroceryCategory.PRODUCE)
      expect(getCategoryFromName('banana')).toBe(GroceryCategory.PRODUCE)
      expect(getCategoryFromName('CARROT')).toBe(GroceryCategory.PRODUCE)
      expect(getCategoryFromName('Organic Spinach')).toBe(GroceryCategory.PRODUCE)
    })

    it('should categorize dairy items correctly', () => {
      expect(getCategoryFromName('Milk')).toBe(GroceryCategory.DAIRY)
      expect(getCategoryFromName('cheese')).toBe(GroceryCategory.DAIRY)
      expect(getCategoryFromName('Greek Yogurt')).toBe(GroceryCategory.DAIRY)
      expect(getCategoryFromName('Crème Fraîche')).toBe(GroceryCategory.DAIRY)
    })

    it('should categorize meat items correctly', () => {
      expect(getCategoryFromName('Beef')).toBe(GroceryCategory.MEAT)
      expect(getCategoryFromName('chicken breast')).toBe(GroceryCategory.MEAT)
      expect(getCategoryFromName('Ground Turkey')).toBe(GroceryCategory.MEAT)
      expect(getCategoryFromName('salmon fillet')).toBe(GroceryCategory.MEAT)
    })

    it('should categorize bakery items correctly', () => {
      expect(getCategoryFromName('Bread')).toBe(GroceryCategory.BAKERY)
      expect(getCategoryFromName('whole wheat bagel')).toBe(GroceryCategory.BAKERY)
      expect(getCategoryFromName('Croissant')).toBe(GroceryCategory.BAKERY)
    })

    it('should categorize pantry items correctly', () => {
      expect(getCategoryFromName('Rice')).toBe(GroceryCategory.PANTRY)
      expect(getCategoryFromName('oats')).toBe(GroceryCategory.PANTRY)
      expect(getCategoryFromName('Canned Beans')).toBe(GroceryCategory.PANTRY)
      expect(getCategoryFromName('Olive Oil')).toBe(GroceryCategory.PANTRY)
    })

    it('should categorize beverages correctly', () => {
      expect(getCategoryFromName('Coffee')).toBe(GroceryCategory.BEVERAGES)
      expect(getCategoryFromName('Cranberry Juice')).toBe(GroceryCategory.BEVERAGES)
      expect(getCategoryFromName('Sparkling Water')).toBe(GroceryCategory.BEVERAGES)
    })

    it('should categorize household items correctly', () => {
      expect(getCategoryFromName('Toothpaste')).toBe(GroceryCategory.HOUSEHOLD)
      expect(getCategoryFromName('Dish Soap')).toBe(GroceryCategory.HOUSEHOLD)
      expect(getCategoryFromName('Laundry Detergent')).toBe(GroceryCategory.HOUSEHOLD)
    })

    it('should return OTHER for unrecognized items', () => {
      expect(getCategoryFromName('Unknown Item')).toBe(GroceryCategory.OTHER)
      expect(getCategoryFromName('Random Product')).toBe(GroceryCategory.OTHER)
      expect(getCategoryFromName('')).toBe(GroceryCategory.OTHER)
    })
  })

  describe('getCategoryFromItemOrDefault', () => {
    it('should use default category when provided and valid', () => {
      expect(getCategoryFromItemOrDefault('Apple', GroceryCategory.DAIRY)).toBe(GroceryCategory.DAIRY)
      expect(getCategoryFromItemOrDefault('Unknown', GroceryCategory.PANTRY)).toBe(GroceryCategory.PANTRY)
    })

    it('should fall back to name-based categorization when default is invalid', () => {
      expect(getCategoryFromItemOrDefault('Apple', 'invalid-category')).toBe(GroceryCategory.PRODUCE)
      expect(getCategoryFromItemOrDefault('Milk', undefined)).toBe(GroceryCategory.DAIRY)
      expect(getCategoryFromItemOrDefault('Bread', '')).toBe(GroceryCategory.BAKERY)
    })

    it('should use name-based categorization when no default provided', () => {
      expect(getCategoryFromItemOrDefault('Coffee')).toBe(GroceryCategory.BEVERAGES)
      expect(getCategoryFromItemOrDefault('Chicken')).toBe(GroceryCategory.MEAT)
    })
  })
})