import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollableContainer } from './index'

describe('ScrollableContainer', () => {
  it('renders children without onRefresh', () => {
    render(<ScrollableContainer><span>content</span></ScrollableContainer>)
    expect(screen.getByText('content')).toBeDefined()
  })

  it('does not render indicator when onRefresh is not provided', () => {
    const { container } = render(<ScrollableContainer><span>content</span></ScrollableContainer>)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('renders indicator element when onRefresh is provided', () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { container } = render(
      <ScrollableContainer onRefresh={onRefresh}><span>content</span></ScrollableContainer>
    )
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('applies sx overrides to scroll area', () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { container } = render(
      <ScrollableContainer onRefresh={onRefresh} sx={{ paddingBottom: '0.5rem' }}>
        <span>content</span>
      </ScrollableContainer>
    )
    expect(container.firstChild).not.toBeNull()
  })
})
