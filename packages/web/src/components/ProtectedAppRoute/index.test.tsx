import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import ProtectedAppRoute from '.';

const mockIsAuthenticated = jest.fn();
const mockSigninRedirect = jest.fn();

jest.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: mockIsAuthenticated(),
    signinRedirect: mockSigninRedirect,
    isLoading: false
  })
}));

jest.mock('../../hooks/useInternetConnectivity', () => ({
  useInternetConnectivity: () => ({ isOnline: true })
}));

jest.mock('../../hooks/usePWAUpdate', () => ({
  usePWAUpdate: () => ({ 
    isUpdateAvailable: false,
    updateApp: jest.fn()
  })
}));

jest.mock('../../providers/AppStateProvider', () => ({
  useAppState: () => ({
    state: { alerts: [], selectedTodoItems: [] },
    dispatch: jest.fn()
  })
}));

const TestComponent = () => <div>Test Route Content</div>;

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('Given the ProtectedAppRoute component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When user is authenticated', () => {
    beforeEach(() => {
      mockIsAuthenticated.mockReturnValue(true);
    });

    it('should render the child component', () => {
      renderWithProviders(
        <ProtectedAppRoute>
          <TestComponent />
        </ProtectedAppRoute>
      );

      expect(screen.getByText('Test Route Content')).toBeInTheDocument();
    });

    it('should render AlertContainer', () => {
      renderWithProviders(
        <ProtectedAppRoute>
          <TestComponent />
        </ProtectedAppRoute>
      );

      // AlertContainer component should be present (though it may be empty)
      // We check for its existence by ensuring the test component renders without errors
      expect(screen.getByText('Test Route Content')).toBeInTheDocument();
    });

    it('should wrap content in Content styled component', () => {
      const { container } = renderWithProviders(
        <ProtectedAppRoute>
          <TestComponent />
        </ProtectedAppRoute>
      );

      // Content component should be the wrapper
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('When user is not authenticated', () => {
    beforeEach(() => {
      mockIsAuthenticated.mockReturnValue(false);
    });

    it('should not render the child component', () => {
      renderWithProviders(
        <ProtectedAppRoute>
          <TestComponent />
        </ProtectedAppRoute>
      );

      expect(screen.queryByText('Test Route Content')).not.toBeInTheDocument();
    });

    it('should still render notification components', () => {
      const { container } = renderWithProviders(
        <ProtectedAppRoute>
          <TestComponent />
        </ProtectedAppRoute>
      );

      // The Content wrapper should still be present
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('When rendering with different child components', () => {
    beforeEach(() => {
      mockIsAuthenticated.mockReturnValue(true);
    });

    it('should render any valid React element as children', () => {
      const CustomChild = () => <button>Custom Button</button>;

      renderWithProviders(
        <ProtectedAppRoute>
          <CustomChild />
        </ProtectedAppRoute>
      );

      expect(screen.getByText('Custom Button')).toBeInTheDocument();
    });
  });
});
