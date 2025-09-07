import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import ModernPageHeader from './index'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ChecklistIcon from '@mui/icons-material/Checklist'
import StorefrontIcon from '@mui/icons-material/Storefront'

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ModernPageHeader', () => {
  describe('basic rendering', () => {
    it('should render with title and icon', () => {
      renderWithTheme(
        <ModernPageHeader
          title="Test Title"
          icon={<ShoppingCartIcon />}
        />
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByTestId('ShoppingCartIcon')).toBeInTheDocument()
    })

    it('should render with different icons', () => {
      renderWithTheme(
        <ModernPageHeader
          title="ToDo List"
          icon={<ChecklistIcon />}
        />
      )

      expect(screen.getByText('ToDo List')).toBeInTheDocument()
      expect(screen.getByTestId('ChecklistIcon')).toBeInTheDocument()
    })
  })

  describe('stats display', () => {
    const mockStats = [
      { value: 10, label: 'Total Items' },
      { value: 3, label: 'Remaining' },
      { value: 7, label: 'Purchased' }
    ]

    it('should render stats when provided', () => {
      renderWithTheme(
        <ModernPageHeader
          title="Grocery List"
          icon={<ShoppingCartIcon />}
          stats={mockStats}
        />
      )

      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('Total Items')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('Remaining')).toBeInTheDocument()
      expect(screen.getByText('7')).toBeInTheDocument()
      expect(screen.getByText('Purchased')).toBeInTheDocument()
    })

    it('should not render stats section when stats array is empty', () => {
      renderWithTheme(
        <ModernPageHeader
          title="Grocery List"
          icon={<ShoppingCartIcon />}
          stats={[]}
        />
      )

      expect(screen.getByText('Grocery List')).toBeInTheDocument()
      expect(screen.queryByText('Total Items')).not.toBeInTheDocument()
    })

    it('should not render stats section when stats is undefined', () => {
      renderWithTheme(
        <ModernPageHeader
          title="Grocery List"
          icon={<ShoppingCartIcon />}
        />
      )

      expect(screen.getByText('Grocery List')).toBeInTheDocument()
      expect(screen.queryByText('Total Items')).not.toBeInTheDocument()
    })

    it('should handle wide stats', () => {
      const wideStats = [
        { value: 100, label: 'Total Items', wide: true },
        { value: 25, label: 'Remaining' }
      ]

      renderWithTheme(
        <ModernPageHeader
          title="Grocery List"
          icon={<ShoppingCartIcon />}
          stats={wideStats}
        />
      )

      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('Total Items')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('Remaining')).toBeInTheDocument()
    })
  })

  describe('layout behavior', () => {
    it('should always display title and stats on separate lines regardless of content length', () => {
      renderWithTheme(
        <ModernPageHeader
          title="Very Long Title That Would Previously Cause Layout Issues"
          icon={<ShoppingCartIcon />}
          stats={[
            { value: 999999, label: 'Very Long Label Name' },
            { value: 888888, label: 'Another Long Label' },
            { value: 777777, label: 'Third Long Label' }
          ]}
        />
      )

      expect(screen.getByText('Very Long Title That Would Previously Cause Layout Issues')).toBeInTheDocument()
      expect(screen.getByText('999999')).toBeInTheDocument()
      expect(screen.getByText('Very Long Label Name')).toBeInTheDocument()
      expect(screen.getByText('888888')).toBeInTheDocument()
      expect(screen.getByText('Another Long Label')).toBeInTheDocument()
      expect(screen.getByText('777777')).toBeInTheDocument()
      expect(screen.getByText('Third Long Label')).toBeInTheDocument()
    })

    it('should render both title section and stats section when stats are provided', () => {
      renderWithTheme(
        <ModernPageHeader
          title="Test Title"
          icon={<ShoppingCartIcon />}
          stats={[
            { value: 10, label: 'Total' },
            { value: 5, label: 'Remaining' }
          ]}
        />
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('Total')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Remaining')).toBeInTheDocument()
    })
  })

  describe('action button', () => {
    it('should render action button when provided', () => {
      const mockOnClick = jest.fn()
      
      renderWithTheme(
        <ModernPageHeader
          title="Grocery List"
          icon={<ShoppingCartIcon />}
          actionButton={{
            icon: <StorefrontIcon />,
            onClick: mockOnClick,
            tooltip: "Back to Shops",
            ariaLabel: "Navigate back to shops list"
          }}
        />
      )

      expect(screen.getByLabelText('Navigate back to shops list')).toBeInTheDocument()
      expect(screen.getByTestId('StorefrontIcon')).toBeInTheDocument()
    })

    it('should call onClick when action button is clicked', () => {
      const mockOnClick = jest.fn()
      
      renderWithTheme(
        <ModernPageHeader
          title="Grocery List"
          icon={<ShoppingCartIcon />}
          actionButton={{
            icon: <StorefrontIcon />,
            onClick: mockOnClick,
            tooltip: "Back to Shops",
            ariaLabel: "Navigate back to shops list"
          }}
        />
      )

      const actionButton = screen.getByLabelText('Navigate back to shops list')
      fireEvent.click(actionButton)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should not render action button when not provided', () => {
      renderWithTheme(
        <ModernPageHeader
          title="Grocery List"
          icon={<ShoppingCartIcon />}
        />
      )

      expect(screen.queryByLabelText('Navigate back to shops list')).not.toBeInTheDocument()
      expect(screen.queryByTestId('StorefrontIcon')).not.toBeInTheDocument()
    })

    it('should render action button alongside stats', () => {
      const mockOnClick = jest.fn()
      const mockStats = [
        { value: 10, label: 'Total Items' },
        { value: 3, label: 'Remaining' }
      ]
      
      renderWithTheme(
        <ModernPageHeader
          title="Grocery List"
          icon={<ShoppingCartIcon />}
          stats={mockStats}
          actionButton={{
            icon: <StorefrontIcon />,
            onClick: mockOnClick,
            tooltip: "Back to Shops",
            ariaLabel: "Navigate back to shops list"
          }}
        />
      )

      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('Total Items')).toBeInTheDocument()
      expect(screen.getByLabelText('Navigate back to shops list')).toBeInTheDocument()
      expect(screen.getByTestId('StorefrontIcon')).toBeInTheDocument()
    })
  })
})
