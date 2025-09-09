import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ChecklistIcon from '@mui/icons-material/Checklist'
import theme from '../../theme'
import SectionCard from './index'

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Given the SectionCard component', () => {
  const defaultProps = {
    icon: ShoppingCartIcon,
    title: 'Test Section',
    count: 5,
    children: <div>Test content</div>
  }

  describe('When rendered with required props', () => {
    it('should display the section title', () => {
      renderWithTheme(<SectionCard {...defaultProps} />)
      
      expect(screen.getByText('Test Section')).toBeInTheDocument()
    })

    it('should display the count', () => {
      renderWithTheme(<SectionCard {...defaultProps} />)
      
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render the children content', () => {
      renderWithTheme(<SectionCard {...defaultProps} />)
      
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should render the icon', () => {
      renderWithTheme(<SectionCard {...defaultProps} />)
      
      expect(document.querySelector('.MuiSvgIcon-root')).toBeInTheDocument()
    })

    it('should have the proper section header structure', () => {
      renderWithTheme(<SectionCard {...defaultProps} />)
      
      expect(screen.getByText('Test Section')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(document.querySelector('.MuiSvgIcon-root')).toBeInTheDocument()
    })
  })

  describe('When rendered with different icons', () => {
    it('should render ChecklistIcon when provided', () => {
      const propsWithChecklistIcon = {
        ...defaultProps,
        icon: ChecklistIcon,
        title: 'Checklist Section'
      }
      
      renderWithTheme(<SectionCard {...propsWithChecklistIcon} />)
      
      expect(screen.getByText('Checklist Section')).toBeInTheDocument()
      expect(document.querySelector('.MuiSvgIcon-root')).toBeInTheDocument()
    })
  })

  describe('When rendered with different count values', () => {
    it('should display zero count correctly', () => {
      const propsWithZeroCount = {
        ...defaultProps,
        count: 0
      }
      
      renderWithTheme(<SectionCard {...propsWithZeroCount} />)
      
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should display large count values correctly', () => {
      const propsWithLargeCount = {
        ...defaultProps,
        count: 999
      }
      
      renderWithTheme(<SectionCard {...propsWithLargeCount} />)
      
      expect(screen.getByText('999')).toBeInTheDocument()
    })
  })

  describe('When rendered with complex children', () => {
    it('should render multiple child elements', () => {
      const complexChildren = (
        <>
          <div>First child</div>
          <p>Second child</p>
          <button>Third child</button>
        </>
      )
      
      const propsWithComplexChildren = {
        ...defaultProps,
        children: complexChildren
      }
      
      renderWithTheme(<SectionCard {...propsWithComplexChildren} />)
      
      expect(screen.getByText('First child')).toBeInTheDocument()
      expect(screen.getByText('Second child')).toBeInTheDocument()
      expect(screen.getByText('Third child')).toBeInTheDocument()
    })

    it('should render nested components as children', () => {
      const nestedChildren = (
        <div className="nested-container">
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      )
      
      const propsWithNestedChildren = {
        ...defaultProps,
        children: nestedChildren
      }
      
      renderWithTheme(<SectionCard {...propsWithNestedChildren} />)
      
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(document.querySelector('.nested-container')).toBeInTheDocument()
    })
  })

  describe('When rendered with FullWidthSection wrapper', () => {
    it('should always render with FullWidthSection wrapper', () => {
      const { container } = renderWithTheme(
        <SectionCard {...defaultProps} />
      )
      
      expect(screen.getByText('Test Section')).toBeInTheDocument()
      expect(container.querySelector('.MuiBox-root')).toBeInTheDocument()
    })
  })

  describe('When rendered with different title values', () => {
    it('should handle empty title string', () => {
      const propsWithEmptyTitle = {
        ...defaultProps,
        title: ''
      }
      
      renderWithTheme(<SectionCard {...propsWithEmptyTitle} />)
      
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('should handle long title strings', () => {
      const propsWithLongTitle = {
        ...defaultProps,
        title: 'This is a very long section title that might wrap'
      }
      
      renderWithTheme(<SectionCard {...propsWithLongTitle} />)
      
      expect(screen.getByText('This is a very long section title that might wrap')).toBeInTheDocument()
    })

    it('should handle titles with special characters', () => {
      const propsWithSpecialTitle = {
        ...defaultProps,
        title: 'Section & Items (123) - Test!'
      }
      
      renderWithTheme(<SectionCard {...propsWithSpecialTitle} />)
      
      expect(screen.getByText('Section & Items (123) - Test!')).toBeInTheDocument()
    })
  })
})
