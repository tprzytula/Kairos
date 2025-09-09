import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../../../../theme'
import { EmptyState } from './index'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('EmptyState component', () => {
  describe('when rendered with text content', () => {
    it('should display the provided text', () => {
      renderWithTheme(
        <EmptyState>No items found</EmptyState>
      )
      
      expect(screen.getByText('No items found')).toBeInTheDocument()
    })
  })

  describe('when rendered with complex content', () => {
    it('should display the provided content', () => {
      renderWithTheme(
        <EmptyState>
          <span>No data available</span>
          <br />
          <span>Please try again later</span>
        </EmptyState>
      )
      
      expect(screen.getByText('No data available')).toBeInTheDocument()
      expect(screen.getByText('Please try again later')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply correct CSS classes and styles', () => {
      const { container } = renderWithTheme(
        <EmptyState>Test content</EmptyState>
      )
      
      const emptyStateElement = container.firstChild
      expect(emptyStateElement).toHaveStyle({
        textAlign: 'center',
        fontStyle: 'italic',
        padding: '1rem'
      })
    })
  })
})
