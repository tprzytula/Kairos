import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import CompleteTaskBanner from '.'

describe('Given the CompleteTaskBanner component', () => {
  it('should render the completion text', () => {
    render(<CompleteTaskBanner onClick={vi.fn()} />)
    expect(screen.getByText(/all steps done/i)).toBeVisible()
  })

  it('should call onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<CompleteTaskBanner onClick={onClick} />)
    await userEvent.click(screen.getByText(/all steps done/i))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('should render in compact mode', () => {
    render(<CompleteTaskBanner onClick={vi.fn()} compact />)
    expect(screen.getByText(/all steps done/i)).toBeVisible()
  })
})
