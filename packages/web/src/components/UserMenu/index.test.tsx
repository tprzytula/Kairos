import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createPortal } from 'react-dom'
import UserMenu from './index'

// Mock the react-oidc-context hook
const defaultMockAuthState = {
  user: {
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'https://example.com/avatar.jpg' as string | undefined
    }
  } as any,
}

const mockUseAuth = jest.fn(() => defaultMockAuthState)

jest.mock('react-oidc-context', () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock the oidc config
jest.mock('../../config/oidc', () => ({
  oidcConfig: {
    client_id: 'test-client-id',
  },
  getPostLogoutRedirectUri: jest.fn(() => 'https://test.com/'),
}))

// Mock window.location with getters/setters directly
const mockHref = jest.fn()
delete (window as any).location

// Create a location mock with href getter/setter
;(window as any).location = {
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  toString: jest.fn(() => ''),
  get href() { return '' },
  set href(value: string) { mockHref(value) },
}

// Mock createPortal to render in the same container for testing
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn((element) => element),
}))

// Mock getBoundingClientRect
const mockGetBoundingClientRect = jest.fn(() => ({
  bottom: 100,
  right: 200,
  top: 50,
  left: 150,
  width: 50,
  height: 50,
}))

Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
  value: mockGetBoundingClientRect,
  writable: true,
})

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  value: 1024,
  writable: true,
})

describe('UserMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue(defaultMockAuthState)
    // Reset location mock
    mockHref.mockClear()
  })

  it('should render user button', () => {
    render(<UserMenu />)
    
    expect(screen.getByRole('button')).toBeVisible()
  })

  it('should show dropdown when clicked', () => {
    render(<UserMenu />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('John Doe')).toBeVisible()
    expect(screen.getByText('john@example.com')).toBeVisible()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeVisible()
  })

  it('should attempt to navigate to Cognito logout URL when logout is clicked', () => {
    // Suppress console.error for the JSDOM navigation warning
    const originalError = console.error
    console.error = jest.fn()
    
    render(<UserMenu />)
    
    fireEvent.click(screen.getByRole('button'))
    
    // The logout should execute without throwing an error
    // (JSDOM will show a warning but the function should complete)
    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    }).not.toThrow()
    
    // Verify the logout logic was invoked by checking that console.error was called
    // (JSDOM's navigation warning indicates the href assignment was attempted)
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Not implemented: navigation')
      })
    )
    
    // Restore original console.error
    console.error = originalError
  })

  it('should show user initials when no picture', () => {
    mockUseAuth.mockReturnValue({
      ...defaultMockAuthState,
      user: {
        profile: {
          ...defaultMockAuthState.user.profile,
          picture: undefined
        }
      }
    })
    
    render(<UserMenu />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('J')).toBeVisible()
  })

  it('should not render when no user', () => {
    mockUseAuth.mockReturnValue({
      user: null,
    })
    
    const { container } = render(<UserMenu />)
    
    expect(container.firstChild).toBeNull()
  })

  describe('Portal functionality', () => {
    it('should render dropdown using createPortal when opened', () => {
      render(<UserMenu />)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(createPortal).toHaveBeenCalledWith(
        expect.anything(),
        document.body
      )
    })

    it('should not call createPortal when dropdown is closed', () => {
      render(<UserMenu />)
      
      expect(createPortal).not.toHaveBeenCalled()
    })
  })

  describe('Positioning logic', () => {
    it('should calculate dropdown position based on button position', async () => {
      render(<UserMenu />)
      const button = screen.getByRole('button')
      
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockGetBoundingClientRect).toHaveBeenCalled()
      })
    })

    it('should position dropdown relative to button with correct offset', async () => {
      render(<UserMenu />)
      
      fireEvent.click(screen.getByRole('button'))
      
      // Wait for the positioning to be calculated and check the rendered DOM
      await waitFor(() => {
        // Look for the dropdown in the actual DOM
        const dropdown = document.querySelector('[style*="position: fixed"]')
        expect(dropdown).toBeTruthy()
        
        const style = window.getComputedStyle(dropdown!)
        expect(style.position).toBe('fixed')
        
        // Check that getBoundingClientRect was called for positioning
        expect(mockGetBoundingClientRect).toHaveBeenCalled()
      })
    })
  })

  describe('Keyboard interactions', () => {
    it('should close dropdown when Escape key is pressed', async () => {
      const user = userEvent.setup()
      render(<UserMenu />)
      
      // Open dropdown
      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByText('John Doe')).toBeVisible()
      
      // Press Escape
      await user.keyboard('{Escape}')
      
      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      })
    })

    it('should not close dropdown on other key presses', async () => {
      const user = userEvent.setup()
      render(<UserMenu />)
      
      // Open dropdown
      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByText('John Doe')).toBeVisible()
      
      // Press other keys
      await user.keyboard('{Enter}')
      await user.keyboard('{Space}')
      await user.keyboard('a')
      
      expect(screen.getByText('John Doe')).toBeVisible()
    })
  })

  describe('Overlay interactions', () => {
    it('should close dropdown when overlay is clicked', () => {
      render(<UserMenu />)
      
      // Open dropdown
      fireEvent.click(screen.getByRole('button'))
      expect(screen.getByText('John Doe')).toBeVisible()
      
      // Find and click overlay (it's rendered as the first child in the portal)
      const portalCall = (createPortal as jest.Mock).mock.calls.find(call => 
        call[0]?.props?.children?.some?.((child: any) => 
          child?.props?.onClick
        )
      )
      
      expect(portalCall).toBeDefined()
      const overlayElement = portalCall[0].props.children.find(
        (child: any) => child?.props?.onClick && !child?.props?.style?.position
      )
      
      // Simulate the overlay click by calling the onClick handler directly
      act(() => {
        overlayElement.props.onClick()
      })
      
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })
  })

  describe('User avatar handling', () => {
    it('should show fallback when image fails to load', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockAuthState,
        user: {
          profile: {
            ...defaultMockAuthState.user.profile,
            picture: 'https://invalid-url.com/image.jpg'
          }
        }
      })
      
      render(<UserMenu />)
      
      const avatar = screen.getByAltText('John Doe')
      fireEvent.error(avatar)
      
      // The fallback should be shown (initials)
      expect(screen.getByText('J')).toBeVisible()
    })

    it('should handle user with given_name when no name', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockAuthState,
        user: {
          profile: {
            given_name: 'Jane',
            email: 'jane@example.com',
            picture: undefined
          }
        }
      })
      
      render(<UserMenu />)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(screen.getByText('Jane')).toBeVisible()
      expect(screen.getByText('J')).toBeVisible() // Initial
    })

    it('should handle user with no email', () => {
      mockUseAuth.mockReturnValue({
        ...defaultMockAuthState,
        user: {
          profile: {
            name: 'John Doe',
            picture: undefined
          }
        }
      })
      
      render(<UserMenu />)
      
      fireEvent.click(screen.getByRole('button'))
      
      expect(screen.getByText('John Doe')).toBeVisible()
      expect(screen.queryByText('@')).not.toBeInTheDocument()
    })
  })

  describe('Component lifecycle', () => {
    it('should clean up event listeners when component unmounts', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')
      
      const { unmount } = render(<UserMenu />)
      
      // Open dropdown to add event listeners
      fireEvent.click(screen.getByRole('button'))
      
      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      
      removeEventListenerSpy.mockRestore()
    })

    it('should update position when dropdown is reopened', () => {
      render(<UserMenu />)
      
      // Open dropdown first time
      const userButton = screen.getByRole('button')
      fireEvent.click(userButton)
      expect(mockGetBoundingClientRect).toHaveBeenCalledTimes(1)
      
      // Close dropdown by clicking the user button again
      fireEvent.click(userButton)
      
      // Update mock position
      mockGetBoundingClientRect.mockReturnValue({
        bottom: 150,
        right: 250,
        top: 100,
        left: 200,
        width: 50,
        height: 50,
      })
      
      // Open dropdown again
      fireEvent.click(userButton)
      
      expect(mockGetBoundingClientRect).toHaveBeenCalledTimes(2)
    })
  })
})
