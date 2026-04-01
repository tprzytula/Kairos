import { Mock } from 'vitest'
import { render, screen } from "@testing-library/react";
import ShopList from ".";
import { useShopContext } from "../../providers/ShopProvider";
import { useNavigate } from "react-router";

vi.mock("../../providers/ShopProvider");
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));
vi.mock("../SwipeableList", () => ({
  default: function MockSwipeableList({ list, component: Component }: any) {
    return (
      <div data-testid="swipeable-list">
        {list.map((item: any) => (
          <div key={item.id} data-testid="shop-item">
            <Component {...item} />
          </div>
        ))}
      </div>
    );
  }
}));

describe("Given the ShopList component", () => {
  beforeEach(() => {
    mockShopContext();
    const mockNavigate = vi.fn();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  it("should render all shops in the list", () => {
    renderShopList();
    
    expect(screen.getByText("Grocery Store")).toBeVisible();
    expect(screen.getByText("Chinese Market")).toBeVisible();
    expect(screen.getByText("Bike Store")).toBeVisible();
  });

  it("should render the SwipeableList component", () => {
    renderShopList();
    
    expect(screen.getByTestId("swipeable-list")).toBeVisible();
  });

  it("should render shop items within the swipeable list", () => {
    renderShopList();
    
    const shopItems = screen.getAllByTestId("shop-item");
    expect(shopItems).toHaveLength(3);
  });

  describe("When the shops list is empty", () => {
    it("should show empty state message", () => {
      mockShopContext();
      const mockNavigate = vi.fn();
      (useNavigate as Mock).mockReturnValue(mockNavigate);

      render(<ShopList shops={[]} onDelete={vi.fn()} onEdit={vi.fn()} />);

      expect(screen.getByText('No shops found')).toBeVisible();
    });
  });

  describe("When the shops list failed to load", () => {
    it("should show error state message", () => {
      (useShopContext as Mock).mockReturnValue({
        currentShop: null,
        setCurrentShop: vi.fn(),
        isLoading: false,
        isError: true,
      });
      const mockNavigate = vi.fn();
      (useNavigate as Mock).mockReturnValue(mockNavigate);

      render(<ShopList shops={[]} onDelete={vi.fn()} onEdit={vi.fn()} />);

      expect(screen.getByText('Unable to load shops')).toBeVisible();
    });
  });

  describe("When the shops list is loading", () => {
    it("should render the loading placeholder", () => {
      (useShopContext as Mock).mockReturnValue({
        currentShop: null,
        setCurrentShop: vi.fn(),
        isLoading: true,
      });
      
      render(<ShopList shops={[]} onDelete={vi.fn()} onEdit={vi.fn()} />);

      expect(screen.getByLabelText('Loading shops')).toBeInTheDocument();
      expect(screen.getAllByLabelText('Shop item placeholder')).toHaveLength(4);
    });
  });
});

const renderShopList = () => {
  render(
    <ShopList 
      shops={EXAMPLE_SHOPS} 
      onDelete={vi.fn()} 
      onEdit={vi.fn()} 
    />
  );
};

const mockShopContext = () => {
  (useShopContext as Mock).mockReturnValue({
    currentShop: null,
    setCurrentShop: vi.fn(),
    isLoading: false,
    isError: false,
  });
};

const EXAMPLE_SHOPS = [
  {
    id: "shop-1",
    projectId: "project-1",
    name: "Grocery Store",
    icon: "/assets/icons/generic-grocery-item.png",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "shop-2",
    projectId: "project-1",
    name: "Chinese Market",
    icon: "/assets/icons/generic-grocery-item.png",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "shop-3",
    projectId: "project-1",
    name: "Bike Store",
    icon: "/assets/icons/generic-grocery-item.png",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
];
