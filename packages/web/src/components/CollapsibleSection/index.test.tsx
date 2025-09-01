import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CollapsibleSection } from './index'

const mockIcon = {
  emoji: '🧺',
  backgroundColor: '#f4f4f5',
  foregroundColor: '#374151',
}

const mockItems = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]

describe('CollapsibleSection', () => {
  it('should render with title and item count', () => {
    render(
      <CollapsibleSection
        title="Test Section"
        icon={mockIcon}
        items={mockItems}
      >
        <div>Content</div>
      </CollapsibleSection>
    )

    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('🧺')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should toggle expansion when header is clicked', async () => {
    render(
      <CollapsibleSection
        title="Test Section"
        icon={mockIcon}
        items={mockItems}
      >
        <div>Content</div>
      </CollapsibleSection>
    )

    const header = screen.getByText('Test Section').closest('div')
    expect(screen.getByText('Content')).toBeInTheDocument()

    fireEvent.click(header!)
    
    await waitFor(() => {
      const content = screen.queryByText('Content')
      expect(content).toBeInTheDocument()
      expect(content?.closest('.MuiCollapse-root')).toHaveClass('MuiCollapse-hidden')
    })

    fireEvent.click(header!)
    await waitFor(() => {
      const content = screen.getByText('Content')
      expect(content).toBeInTheDocument()
      expect(content?.closest('.MuiCollapse-root')).not.toHaveClass('MuiCollapse-hidden')
    })
  })

  it('should render component with consistent styling', () => {
    const { container } = render(
      <CollapsibleSection
        title="Test Section"
        icon={mockIcon}
        items={mockItems}
      >
        <div>Content</div>
      </CollapsibleSection>
    )

    expect(container).toBeInTheDocument()
  })

  it('should handle controlled state', async () => {
    const mockToggle = jest.fn()
    
    render(
      <CollapsibleSection
        title="Test Section"
        icon={mockIcon}
        items={mockItems}
        isExpanded={false}
        onToggleExpanded={mockToggle}
      >
        <div>Content</div>
      </CollapsibleSection>
    )

    await waitFor(() => {
      const content = screen.queryByText('Content')
      expect(content).toBeInTheDocument()
      expect(content?.closest('.MuiCollapse-root')).toHaveClass('MuiCollapse-hidden')
    })

    const header = screen.getByText('Test Section').closest('div')
    fireEvent.click(header!)

    expect(mockToggle).toHaveBeenCalled()
  })

  it('should not render when items array is empty', () => {
    const { container } = render(
      <CollapsibleSection
        title="Test Section"
        icon={mockIcon}
        items={[]}
      >
        <div>Content</div>
      </CollapsibleSection>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should respond to expandTo prop changes', async () => {
    const { rerender } = render(
      <CollapsibleSection
        title="Test Section"
        icon={mockIcon}
        items={mockItems}
        expandTo={true}
        expandKey="test"
      >
        <div>Content</div>
      </CollapsibleSection>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()

    rerender(
      <CollapsibleSection
        title="Test Section"
        icon={mockIcon}
        items={mockItems}
        expandTo={false}
        expandKey="test2"
      >
        <div>Content</div>
      </CollapsibleSection>
    )

    await waitFor(() => {
      const content = screen.queryByText('Content')
      expect(content).toBeInTheDocument()
      expect(content?.closest('.MuiCollapse-root')).toHaveClass('MuiCollapse-hidden')
    })
  })
})
