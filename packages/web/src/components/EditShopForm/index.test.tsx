import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditShopForm from ".";

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe("Given the EditShopForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form fields with initial values", () => {
    renderEditShopForm();
    
    expect(screen.getByDisplayValue('Test Shop')).toBeVisible();
    expect(screen.getByDisplayValue('https://example.com/icon.png')).toBeVisible();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  it("should render initial icon in preview", () => {
    renderEditShopForm();
    
    const iconImage = screen.getByAltText('Shop icon preview');
    expect(iconImage).toBeVisible();
    expect(iconImage).toHaveAttribute('src', 'https://example.com/icon.png');
  });

  describe("When shop has no initial icon", () => {
    it("should render default storefront icon", () => {
      renderEditShopForm({ initialIcon: undefined });
      
      expect(screen.getByTestId('StorefrontIcon')).toBeVisible();
    });
  });

  describe("When user modifies shop name", () => {
    it("should enable save button", async () => {
      renderEditShopForm();
      
      const saveButton = screen.getByRole('button', { name: /save changes/i });
      expect(saveButton).toBeDisabled(); // No changes initially
      
      const nameInput = screen.getByDisplayValue('Test Shop');
      fireEvent.change(nameInput, { target: { value: 'Modified Shop' } });
      
      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });
    });
  });

  describe("When user modifies icon URL", () => {
    it("should enable save button", async () => {
      renderEditShopForm();
      
      const saveButton = screen.getByRole('button', { name: /save changes/i });
      expect(saveButton).toBeDisabled(); // No changes initially
      
      const iconInput = screen.getByDisplayValue('https://example.com/icon.png');
      fireEvent.change(iconInput, { target: { value: 'https://example.com/new-icon.png' } });
      
      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });
    });
  });

  describe("When form validation fails", () => {
    it("should show error for empty shop name", async () => {
      renderEditShopForm();
      
      const nameInput = screen.getByDisplayValue('Test Shop');
      fireEvent.change(nameInput, { target: { value: '' } });
      
      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/shop name is required/i)).toBeVisible();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should show error for shop name that's too short", async () => {
      renderEditShopForm();
      
      const nameInput = screen.getByDisplayValue('Test Shop');
      fireEvent.change(nameInput, { target: { value: 'A' } });
      
      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/shop name must be at least 2 characters/i)).toBeVisible();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("When form is submitted with changes", () => {
    it("should call onSubmit with updated values", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      renderEditShopForm();
      
      const nameInput = screen.getByDisplayValue('Test Shop');
      const iconInput = screen.getByDisplayValue('https://example.com/icon.png');
      
      fireEvent.change(nameInput, { target: { value: 'Updated Shop' } });
      fireEvent.change(iconInput, { target: { value: 'https://example.com/new-icon.png' } });
      
      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          'shop-123',
          'Updated Shop',
          'https://example.com/new-icon.png'
        );
      });
    });

    it("should call onSubmit with undefined icon when cleared", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      renderEditShopForm();
      
      const nameInput = screen.getByDisplayValue('Test Shop');
      const iconInput = screen.getByDisplayValue('https://example.com/icon.png');
      
      fireEvent.change(nameInput, { target: { value: 'Updated Shop' } });
      fireEvent.change(iconInput, { target: { value: '' } });
      
      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          'shop-123',
          'Updated Shop',
          undefined
        );
      });
    });
  });

  describe("When form has no changes", () => {
    it("should disable the save button", () => {
      renderEditShopForm();
      
      const submitButton = screen.getByRole('button', { name: /save changes/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("When form submission fails", () => {
    it("should display error message", async () => {
      mockOnSubmit.mockRejectedValue(new Error('Shop name already exists'));
      renderEditShopForm();
      
      const nameInput = screen.getByDisplayValue('Test Shop');
      fireEvent.change(nameInput, { target: { value: 'Conflicting Shop' } });
      
      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/shop name already exists/i)).toBeVisible();
      });
    });
  });

  describe("When cancel button is clicked", () => {
    it("should call onCancel", () => {
      renderEditShopForm();
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe("When form is submitting", () => {
    it("should show loading state", () => {
      renderEditShopForm({ isSubmitting: true });
      
      expect(screen.getByText(/saving.../i)).toBeVisible();
      expect(screen.getByRole('button', { name: /saving.../i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });
  });

  describe("When initial values change", () => {
    it("should reset form state", () => {
      const { rerender } = render(
        <EditShopForm 
          shopId="shop-123"
          initialName="Original Shop"
          initialIcon="https://example.com/original.png"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );
      
      // Change the initial values
      rerender(
        <EditShopForm 
          shopId="shop-123"
          initialName="New Shop"
          initialIcon="https://example.com/new.png"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );
      
      expect(screen.getByDisplayValue('New Shop')).toBeVisible();
      expect(screen.getByDisplayValue('https://example.com/new.png')).toBeVisible();
    });
  });
});

const renderEditShopForm = (props = {}) => {
  const defaultProps = {
    shopId: 'shop-123',
    initialName: 'Test Shop',
    initialIcon: 'https://example.com/icon.png',
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    ...props
  };
  
  render(<EditShopForm {...defaultProps} />);
};
