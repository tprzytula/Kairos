import { render, screen } from '@testing-library/react'
import SilentCallback from './index'

describe('SilentCallback', () => {
  it('should render silent authentication message', () => {
    render(<SilentCallback />)
    
    expect(screen.getByText('Silent authentication in progress...')).toBeVisible()
  })
})
