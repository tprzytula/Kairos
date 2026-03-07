import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddShopForm from ".";

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();
const mockGetShopUploadUrl = jest.fn();

jest.mock('../../providers/ProjectProvider', () => ({
  useProjectContext: () => ({ currentProject: { id: 'test-project-id' } })
}));

jest.mock('../../api/shops/getUploadUrl', () => ({
  getShopUploadUrl: (...args: any[]) => mockGetShopUploadUrl(...args)
}));

jest.mock('../RecipeForm/ImageCropModal', () => {
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

jest.mock('../RecipeForm/cropUtils', () => ({
  getCroppedBlob: jest.fn().mockResolvedValue(new Blob(['img'], { type: 'image/jpeg' }))
}));

describe("Given the AddShopForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn().mockReturnValue('blob:mock-url');
  });

  it("should render form fields correctly", () => {
    renderAddShopForm();

    expect(screen.getByLabelText(/shop name/i)).toBeVisible();
    expect(screen.getByLabelText(/upload shop icon/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /create shop/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  it("should render image upload box with placeholder text initially", () => {
    renderAddShopForm();

    expect(screen.getByText(/add shop icon/i)).toBeVisible();
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

  describe("When user uploads a shop icon", () => {
    it("should show image preview after upload", async () => {
      mockGetShopUploadUrl.mockResolvedValue({
        uploadUrl: 'https://s3.example.com/upload',
        imagePath: 'https://cdn.example.com/shops/test.jpg'
      });
      fetchMock.mockResponseOnce('');

      renderAddShopForm();

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['img'], 'icon.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByAltText(/shop icon preview/i)).toBeVisible();
      });
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

    it("should call onSubmit with shop name and icon after upload", async () => {
      mockOnSubmit.mockResolvedValue(undefined);
      mockGetShopUploadUrl.mockResolvedValue({
        uploadUrl: 'https://s3.example.com/upload',
        imagePath: 'https://cdn.example.com/shops/test.jpg'
      });
      fetchMock.mockResponseOnce('');

      renderAddShopForm();

      const nameInput = screen.getByLabelText(/shop name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Shop' } });

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['img'], 'icon.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockGetShopUploadUrl).toHaveBeenCalled();
      });

      const submitButton = screen.getByRole('button', { name: /create shop/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('Test Shop', 'https://cdn.example.com/shops/test.jpg');
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
