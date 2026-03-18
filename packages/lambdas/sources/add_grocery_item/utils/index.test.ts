import { fetchDefaults, getCategoryForItem, GroceryItemDefault } from "./index";
import { scan } from "@kairos-lambdas-libs/dynamodb";
import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";
import { getCategory } from "../../db_migrations/migrations/001_add_grocery_defaults/data/categoryMappings";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
  scan: jest.fn(),
  DynamoDBTable: {
    GROCERY_ITEMS_DEFAULTS: "GroceryItemsDefaults",
  },
}));

jest.mock("../../db_migrations/migrations/001_add_grocery_defaults/data/categoryMappings", () => ({
  getCategory: jest.fn(),
}));

describe('fetchDefaults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should scan the grocery items defaults table', async () => {
    jest.mocked(scan).mockResolvedValue(mockDefaults);

    const result = await fetchDefaults();

    expect(scan).toHaveBeenCalledWith({
      tableName: "GroceryItemsDefaults",
    });
    expect(result).toEqual(mockDefaults);
  });

  it('should return empty array on scan error', async () => {
    jest.mocked(scan).mockRejectedValue(new Error("Database error"));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await fetchDefaults();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch grocery defaults:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

describe('getCategoryForItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return category for item found in defaults', () => {
    jest.mocked(getCategory).mockReturnValue(GroceryItemCategory.FRUITS_VEGETABLES);

    const result = getCategoryForItem("apple", mockDefaults);

    expect(getCategory).toHaveBeenCalledWith("apple");
    expect(result).toBe(GroceryItemCategory.FRUITS_VEGETABLES);
  });

  it('should return category for item not found in defaults using fallback', () => {
    jest.mocked(getCategory).mockReturnValue(GroceryItemCategory.OTHER);

    const result = getCategoryForItem("unknown item", mockDefaults);

    expect(getCategory).toHaveBeenCalledWith("unknown item");
    expect(result).toBe(GroceryItemCategory.OTHER);
  });

  it('should handle case insensitive matching', () => {
    jest.mocked(getCategory).mockReturnValue(GroceryItemCategory.FRUITS_VEGETABLES);

    const result = getCategoryForItem("APPLE", mockDefaults);

    expect(getCategory).toHaveBeenCalledWith("apple");
    expect(result).toBe(GroceryItemCategory.FRUITS_VEGETABLES);
  });
});

const mockDefaults: GroceryItemDefault[] = [
  { name: "apple", icon: "/icons/apple.png", unit: "unit(s)" },
  { name: "banana", icon: "/icons/banana.png", unit: "unit(s)" },
];
