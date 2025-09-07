import { render, screen } from "@testing-library/react";
import ShopList from ".";
import { useShopContext } from "../../providers/ShopProvider";
import { useNavigate } from "react-router";

jest.mock("../../providers/ShopProvider");
jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("../SwipeableList", () => {
  return function MockSwipeableList({ list, component: Component }: any) {
    return (
      <div data-testid="swipeable-list">
        {list.map((item: any) => (
          <div key={item.id} data-testid="shop-item">
            <Component {...item} />
          </div>
        ))}
      </div>
    );
  };
});

describe("Given the ShopList component", () => {
  beforeEach(() => {
    mockShopContext();
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
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
    it("should render without errors", () => {
      mockShopContext();
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
      
      render(<ShopList shops={[]} onDelete={jest.fn()} onEdit={jest.fn()} />);
      
      expect(screen.getByTestId("swipeable-list")).toBeVisible();
      expect(screen.queryAllByTestId("shop-item")).toHaveLength(0);
    });
  });
});

const renderShopList = () => {
  render(
    <ShopList 
      shops={EXAMPLE_SHOPS} 
      onDelete={jest.fn()} 
      onEdit={jest.fn()} 
    />
  );
};

const mockShopContext = () => {
  (useShopContext as jest.Mock).mockReturnValue({
    currentShop: null,
    setCurrentShop: jest.fn(),
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
