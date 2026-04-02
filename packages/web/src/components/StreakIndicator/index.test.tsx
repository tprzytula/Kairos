import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StreakIndicator from '.'

describe('Given the StreakIndicator component', () => {
  it('should show streak count when visible and count >= 3', () => {
    render(<StreakIndicator count={5} visible />)
    expect(screen.getByText('x5')).toBeVisible()
  })

  it('should not render when visible is false', () => {
    const { container } = render(<StreakIndicator count={5} visible={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('should not render when count is less than 3', () => {
    const { container } = render(<StreakIndicator count={2} visible />)
    expect(container.firstChild).toBeNull()
  })

  it('should display the bolt icon', () => {
    render(<StreakIndicator count={3} visible />)
    expect(screen.getByText('⚡')).toBeVisible()
  })
})
