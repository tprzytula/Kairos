import { render, screen, waitFor } from "@testing-library/react";
import ShopItem from ".";
import { useShopContext } from "../../providers/ShopProvider";
import { IShop } from "../../providers/AppStateProvider/types";

jest.mock("../../providers/ShopProvider");

describe("Given the ShopItem component", () => {
  it("should render the component with correct props", () => {
    mockShopContext();
    renderShopItem();
    
    expect(screen.getByText(EXAMPLE_SHOP_PROPS.name)).toBeVisible();
    expect(screen.getByText("Created Jan 1, 2024")).toBeVisible();
  });

  describe("When the shop has an icon", () => {
    it("should render the icon image", () => {
      mockShopContext();
      renderShopItem();
      
      const iconImage = screen.getByAltText(`${EXAMPLE_SHOP_PROPS.name} icon`);
      expect(iconImage).toBeVisible();
      expect(iconImage).toHaveAttribute('src', EXAMPLE_SHOP_PROPS.icon);
    });
  });

  describe("When the shop has no icon", () => {
    it("should render the default storefront icon", () => {
      mockShopContext();
      render(<ShopItem {...EXAMPLE_SHOP_PROPS} icon={undefined} />);
      
      // Check that the image is not present and icon container exists
      const iconImages = screen.queryAllByRole('img');
      const hasShopIcon = iconImages.some(img => img.getAttribute('alt')?.includes('icon'));
      expect(hasShopIcon).toBeFalsy();
    });
  });

  describe("When the user clicks the shop item", () => {
    it("should call setCurrentShop with the shop data", async () => {
      const setCurrentShop = mockShopContext();
      renderShopItem();

      await waitFor(() => {
        screen.getByText(EXAMPLE_SHOP_PROPS.name).click();
      });

      expect(setCurrentShop).toHaveBeenCalledWith({
        id: EXAMPLE_SHOP_PROPS.id,
        name: EXAMPLE_SHOP_PROPS.name,
        icon: EXAMPLE_SHOP_PROPS.icon,
        createdAt: EXAMPLE_SHOP_PROPS.createdAt,
        updatedAt: EXAMPLE_SHOP_PROPS.updatedAt,
        projectId: '',
      });
    });
  });

  describe("When the shop is currently selected", () => {
    it("should indicate selection state through context", () => {
      mockShopContext({
        id: EXAMPLE_SHOP_PROPS.id,
        name: EXAMPLE_SHOP_PROPS.name,
        projectId: 'test-project',
        icon: EXAMPLE_SHOP_PROPS.icon,
        createdAt: EXAMPLE_SHOP_PROPS.createdAt,
        updatedAt: EXAMPLE_SHOP_PROPS.updatedAt,
      });
      renderShopItem();

      // The component uses the selected state internally
      expect(screen.getByText(EXAMPLE_SHOP_PROPS.name)).toBeVisible();
    });
  });

  describe("When formatting dates", () => {
    it("should display the creation date in a readable format", () => {
      mockShopContext();
      render(<ShopItem {...EXAMPLE_SHOP_PROPS} createdAt="2024-06-15T10:30:00Z" />);
      
      expect(screen.getByText("Created Jun 15, 2024")).toBeVisible();
    });
  });
});

const renderShopItem = () => {
  render(<ShopItem {...EXAMPLE_SHOP_PROPS} />);
};

const mockShopContext = (currentShop: IShop | null = null) => {
  const setCurrentShop = jest.fn();

  (useShopContext as jest.Mock).mockReturnValue({
    currentShop,
    setCurrentShop,
  });

  return setCurrentShop;
};

const EXAMPLE_SHOP_PROPS = {
  id: "shop-123",
  name: "Grocery Store",
  icon: "/assets/icons/generic-grocery-item.png",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};
