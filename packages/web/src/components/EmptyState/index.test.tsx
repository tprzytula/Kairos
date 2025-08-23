import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { EmptyState } from './index';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('EmptyState component', () => {
  const mockProps = {
    icon: <ShoppingCartOutlinedIcon aria-label="test-icon" />,
    title: 'Test Title',
    subtitle: 'Test Subtitle'
  };

  describe('When rendering with provided props', () => {
    it('should display the provided icon', () => {
      renderWithTheme(<EmptyState {...mockProps} />);
      
      expect(screen.getByLabelText('test-icon')).toBeVisible();
    });

    it('should display the provided title text', () => {
      renderWithTheme(<EmptyState {...mockProps} />);
      
      expect(screen.getByText('Test Title')).toBeVisible();
    });

    it('should display the provided subtitle text', () => {
      renderWithTheme(<EmptyState {...mockProps} />);
      
      expect(screen.getByText('Test Subtitle')).toBeVisible();
    });
  });

  describe('When checking component structure', () => {
    it('should render all required elements together', () => {
      renderWithTheme(<EmptyState {...mockProps} />);

      expect(screen.getByLabelText('test-icon')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should apply styled components classes', () => {
      renderWithTheme(<EmptyState {...mockProps} />);

      const titleElement = screen.getByText('Test Title');
      const subtitleElement = screen.getByText('Test Subtitle');
      
      expect(titleElement).toHaveAttribute('class');
      expect(subtitleElement).toHaveAttribute('class');
    });
  });
});
