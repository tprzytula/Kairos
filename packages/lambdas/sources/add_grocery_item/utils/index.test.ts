import { fetchDefaults, getCategoryForItem, GroceryItemDefault } from "./index";
import { scan } from "@kairos-lambdas-libs/dynamodb";
import { GroceryItemCategory } from "@kairos-lambdas-libs/dynamodb/enums";
import { getCategory } from "../../db_migrations/migrations/001_add_grocery_defaults/data/categoryMappings";

vi.mock("@kairos-lambdas-libs/dynamodb", async () => ({
  scan: vi.fn(),
  DynamoDBTable: {
    GROCERY_ITEMS_DEFAULTS: "GroceryItemsDefaults",
  },
}));

vi.mock("../../db_migrations/migrations/001_add_grocery_defaults/data/categoryMappings", async () => ({
  getCategory: vi.fn(),
}));

describe('fetchDefaults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should scan the grocery items defaults table', async () => {
    vi.mocked(scan).mockResolvedValue(mockDefaults);

    const result = await fetchDefaults();

    expect(scan).toHaveBeenCalledWith({
      tableName: "GroceryItemsDefaults",
    });
    expect(result).toEqual(mockDefaults);
  });

  it('should return empty array on scan error', async () => {
    vi.mocked(scan).mockRejectedValue(new Error("Database error"));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation();

    const result = await fetchDefaults();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch grocery defaults:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});

describe('getCategoryForItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return category for item found in defaults', () => {
    vi.mocked(getCategory).mockReturnValue(GroceryItemCategory.FRUITS_VEGETABLES);

    const result = getCategoryForItem("apple", mockDefaults);

    expect(getCategory).toHaveBeenCalledWith("apple");
    expect(result).toBe(GroceryItemCategory.FRUITS_VEGETABLES);
  });

  it('should return category for item not found in defaults using fallback', () => {
    vi.mocked(getCategory).mockReturnValue(GroceryItemCategory.OTHER);

    const result = getCategoryForItem("unknown item", mockDefaults);

    expect(getCategory).toHaveBeenCalledWith("unknown item");
    expect(result).toBe(GroceryItemCategory.OTHER);
  });

  it('should handle case insensitive matching', () => {
    vi.mocked(getCategory).mockReturnValue(GroceryItemCategory.FRUITS_VEGETABLES);

    const result = getCategoryForItem("APPLE", mockDefaults);

    expect(getCategory).toHaveBeenCalledWith("apple");
    expect(result).toBe(GroceryItemCategory.FRUITS_VEGETABLES);
  });
});

const mockDefaults: GroceryItemDefault[] = [
  { name: "apple", icon: "/icons/apple.png", unit: "unit(s)" },
  { name: "banana", icon: "/icons/banana.png", unit: "unit(s)" },
];
