import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddShopForm from ".";

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe("Given the AddShopForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form fields correctly", () => {
    renderAddShopForm();
    
    expect(screen.getByLabelText(/shop name/i)).toBeVisible();
    expect(screen.getByLabelText(/shop icon url/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /create shop/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  it("should render default storefront icon initially", () => {
    renderAddShopForm();
    
    expect(screen.getByTestId('StorefrontIcon')).toBeVisible();
  });

  describe("When user enters shop name", () => {
    it("should update the input value", async () => {
      renderAddShopForm();
      
      const nameInput = screen.getByLabelText(/shop name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Shop' } });
      
      expect(nameInput).toHaveValue('Test Shop');
    });

    it("should clear name error when valid name is entered", async () => {
      renderAddShopForm();
      
      const nameInput = screen.getByLabelText(/shop name/i);
      const submitButton = screen.getByRole('button', { name: /create shop/i });
      
      // Submit without name to trigger error
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/shop name is required/i)).toBeVisible();
      });
      
      // Enter valid name
      fireEvent.change(nameInput, { target: { value: 'Valid Shop' } });
      
      await waitFor(() => {
        expect(screen.queryByText(/shop name is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("When user enters shop icon URL", () => {
    it("should update the input value", () => {
      renderAddShopForm();
      
      const iconInput = screen.getByLabelText(/shop icon url/i);
      fireEvent.change(iconInput, { target: { value: 'https://example.com/icon.png' } });
      
      expect(iconInput).toHaveValue('https://example.com/icon.png');
    });
  });

  describe("When form validation fails", () => {
    it("should show error for empty shop name", async () => {
      renderAddShopForm();
      
      const submitButton = screen.getByRole('button', { name: /create shop/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/shop name is required/i)).toBeVisible();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should show error for shop name that's too short", async () => {
      renderAddShopForm();
      
      const nameInput = screen.getByLabelText(/shop name/i);
      fireEvent.change(nameInput, { target: { value: 'A' } });
      
      const submitButton = screen.getByRole('button', { name: /create shop/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/shop name must be at least 2 characters/i)).toBeVisible();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("When form is submitted successfully", () => {
    it("should call onSubmit with shop name only", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      renderAddShopForm();
      
      const nameInput = screen.getByLabelText(/shop name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Shop' } });
      
      const submitButton = screen.getByRole('button', { name: /create shop/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('Test Shop', undefined);
      });
    });

    it("should call onSubmit with shop name and icon", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      renderAddShopForm();
      
      const nameInput = screen.getByLabelText(/shop name/i);
      const iconInput = screen.getByLabelText(/shop icon url/i);
      
      fireEvent.change(nameInput, { target: { value: 'Test Shop' } });
      fireEvent.change(iconInput, { target: { value: 'https://example.com/icon.png' } });
      
      const submitButton = screen.getByRole('button', { name: /create shop/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('Test Shop', 'https://example.com/icon.png');
      });
    });
  });

  describe("When form submission fails", () => {
    it("should display error message", async () => {
      mockOnSubmit.mockRejectedValue(new Error('Shop name already exists'));
      renderAddShopForm();
      
      const nameInput = screen.getByLabelText(/shop name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Shop' } });
      
      const submitButton = screen.getByRole('button', { name: /create shop/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/shop name already exists/i)).toBeVisible();
      });
    });
  });

  describe("When cancel button is clicked", () => {
    it("should call onCancel", () => {
      renderAddShopForm();
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe("When form is submitting", () => {
    it("should show loading state", () => {
      renderAddShopForm({ isSubmitting: true });
      
      expect(screen.getByText(/creating.../i)).toBeVisible();
      expect(screen.getByRole('button', { name: /creating.../i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });
  });
});

const renderAddShopForm = (props = {}) => {
  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
    ...props
  };
  
  render(<AddShopForm {...defaultProps} />);
};
