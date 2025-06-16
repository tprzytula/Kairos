import { render, screen } from "@testing-library/react";
import ItemImage from ".";

describe("Given the ItemImage component", () => {
  describe("When the item name is not provided", () => {
    it("should render the default image", () => {
      render(<ItemImage itemName={undefined} defaults={[]} onChange={jest.fn()} />);

      expect(screen.getByLabelText("Placeholder image")).toBeVisible();
    });
  });

  describe("When the item name is provided", () => {
    describe("And the item name is not in the defaults", () => {
      it("should render the generic image", () => {
        render(
          <ItemImage
            itemName="something"
            defaults={EXAMPLE_DEFAULTS}
            onChange={jest.fn()}
          />
        );

        expect(screen.getByLabelText("something image")).toBeVisible();
      });
    });

    describe("And the item name is in the defaults", () => {
      it("should render the item image", () => {
        render(
          <ItemImage
            itemName="test"
            defaults={EXAMPLE_DEFAULTS}
            onChange={jest.fn()}
          />
        );

        expect(screen.getByLabelText("test image")).toBeVisible();
      });
    });
  });

  describe("When the image path is changed", () => {
    it("should call the onChange function", () => {
      const onChange = jest.fn();
      
      render(
        <ItemImage itemName="test" defaults={EXAMPLE_DEFAULTS} onChange={onChange} />
      );

      expect(onChange).toHaveBeenCalledWith("test-icon");
    });

    describe('And the image path is a generic image', () => {
      it('should call the onChange function', () => {
        const onChange = jest.fn();
       
        render(
          <ItemImage itemName="something" defaults={EXAMPLE_DEFAULTS} onChange={onChange} />
        );

        expect(onChange).toHaveBeenCalledWith("generic-icon");
      });
    });
  });

  describe('When the defaults are not provided', () => {
    it('should render the placeholder image', () => {
      render(<ItemImage itemName="test" defaults={undefined} onChange={jest.fn()} />);

      expect(screen.getByLabelText("Placeholder image")).toBeVisible();
    });
  });
});

export const EXAMPLE_DEFAULTS = [
  { name: "test", icon: "test-icon" },
  { name: "generic", icon: "generic-icon" },
];
