import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditShopForm from ".";

const mockOnSubmit = vi.fn();
const mockOnCancel = vi.fn();
const mockGetShopUploadUrl = vi.fn();

vi.mock('../../providers/ProjectProvider', () => ({
  useProjectContext: () => ({ currentProject: { id: 'test-project-id' } })
}));

vi.mock('../../api/shops/getUploadUrl', () => ({
  getShopUploadUrl: (...args: any[]) => mockGetShopUploadUrl(...args)
}));

vi.mock('../RecipeForm/ImageCropModal', () => {
  const { useEffect } = require('react');
  return {
    __esModule: true,
    default: ({ onConfirm }: any) => {
      useEffect(() => {
        onConfirm({ x: 0, y: 0, width: 100, height: 100 });
      }, []);
      return null;
    }
  };
});

vi.mock('../RecipeForm/cropUtils', () => ({
  getCroppedBlob: vi.fn().mockResolvedValue(new Blob(['img'], { type: 'image/jpeg' }))
}));

describe("Given the EditShopForm component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
  });

  it("should render form fields with initial values", () => {
    renderEditShopForm();

    expect(screen.getByDisplayValue('Test Shop')).toBeVisible();
    expect(screen.getByLabelText(/upload shop icon/i)).toBeVisible();
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
    it("should render upload box with placeholder text", () => {
      renderEditShopForm({ initialIcon: undefined });

      expect(screen.getByText(/add shop icon/i)).toBeVisible();
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

  describe("When user uploads a new icon", () => {
    it("should enable save button after upload", async () => {
      mockGetShopUploadUrl.mockResolvedValue({
        uploadUrl: 'https://s3.example.com/upload',
        imagePath: 'https://cdn.example.com/shops/new.jpg'
      });
      fetchMock.mockResponseOnce('');

      renderEditShopForm();

      const saveButton = screen.getByRole('button', { name: /save changes/i });
      expect(saveButton).toBeDisabled();

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['img'], 'new-icon.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [file] } });

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
    it("should call onSubmit with updated name and existing icon", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      renderEditShopForm();

      const nameInput = screen.getByDisplayValue('Test Shop');
      fireEvent.change(nameInput, { target: { value: 'Updated Shop' } });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          'shop-123',
          'Updated Shop',
          'https://example.com/icon.png',
          false
        );
      });
    });

    it("should call onSubmit with new icon after upload", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      mockGetShopUploadUrl.mockResolvedValue({
        uploadUrl: 'https://s3.example.com/upload',
        imagePath: 'https://cdn.example.com/shops/new.jpg'
      });
      fetchMock.mockResponseOnce('');

      renderEditShopForm();

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['img'], 'new-icon.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockGetShopUploadUrl).toHaveBeenCalled();
      });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          'shop-123',
          'Test Shop',
          'https://cdn.example.com/shops/new.jpg',
          false
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
      const iconImage = screen.getByAltText('Shop icon preview');
      expect(iconImage).toHaveAttribute('src', 'https://example.com/new.png');
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
