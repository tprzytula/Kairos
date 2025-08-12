import { getCategoryForItem } from "./index";
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

describe('getCategoryForItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return category for item found in defaults', async () => {
    const mockDefaults = [
      { name: "apple", icon: "/icons/apple.png", unit: "unit(s)" },
      { name: "banana", icon: "/icons/banana.png", unit: "unit(s)" },
    ];

    jest.mocked(scan).mockResolvedValue(mockDefaults);
    jest.mocked(getCategory).mockReturnValue(GroceryItemCategory.FRUITS_VEGETABLES);

    const result = await getCategoryForItem("apple");

    expect(scan).toHaveBeenCalledWith({
      tableName: "GroceryItemsDefaults",
    });
    expect(getCategory).toHaveBeenCalledWith("apple");
    expect(result).toBe(GroceryItemCategory.FRUITS_VEGETABLES);
  });

  it('should return category for item not found in defaults using fallback', async () => {
    const mockDefaults = [
      { name: "banana", icon: "/icons/banana.png", unit: "unit(s)" },
    ];

    jest.mocked(scan).mockResolvedValue(mockDefaults);
    jest.mocked(getCategory).mockReturnValue(GroceryItemCategory.OTHER);

    const result = await getCategoryForItem("unknown item");

    expect(getCategory).toHaveBeenCalledWith("unknown item");
    expect(result).toBe(GroceryItemCategory.OTHER);
  });

  it('should handle case insensitive matching', async () => {
    const mockDefaults = [
      { name: "apple", icon: "/icons/apple.png", unit: "unit(s)" },
    ];

    jest.mocked(scan).mockResolvedValue(mockDefaults);
    jest.mocked(getCategory).mockReturnValue(GroceryItemCategory.FRUITS_VEGETABLES);

    const result = await getCategoryForItem("APPLE");

    expect(getCategory).toHaveBeenCalledWith("apple");
    expect(result).toBe(GroceryItemCategory.FRUITS_VEGETABLES);
  });

  it('should handle scan errors gracefully', async () => {
    jest.mocked(scan).mockRejectedValue(new Error("Database error"));
    jest.mocked(getCategory).mockReturnValue(GroceryItemCategory.OTHER);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await getCategoryForItem("apple");

    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch grocery defaults:', expect.any(Error));
    expect(getCategory).toHaveBeenCalledWith("apple");
    expect(result).toBe(GroceryItemCategory.OTHER);

    consoleSpy.mockRestore();
  });
});