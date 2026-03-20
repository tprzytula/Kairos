import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@mui/material/styles'
import AddItemButton from '.'
import { Route } from '../../../enums/route'
import * as ReactRouter from 'react-router'
import * as NoiseTrackingProvider from '../../../providers/NoiseTrackingProvider'
import * as NoiseTrackingAPI from '../../../api/noiseTracking'
import theme from '../../../theme'

// Mock the external dependencies
const mockNavigate = vi.fn()
const mockRefetchNoiseTrackingItems = vi.fn()
const mockAddNoiseTrackingItem = vi.fn()

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: () => mockNavigate,
  useLocation: vi.fn(),
}))

vi.mock('../../../providers/NoiseTrackingProvider')
vi.mock('../../../api/noiseTracking')

const renderWithProviders = (children: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('Given the AddItemButton component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    vi.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [],
      isLoading: false,
      refetchNoiseTrackingItems: mockRefetchNoiseTrackingItems,
    })
    
    vi.spyOn(NoiseTrackingAPI, 'addNoiseTrackingItem').mockImplementation(mockAddNoiseTrackingItem)
  })

  describe('When on the Home page', () => {
    beforeEach(() => {
      vi.spyOn(ReactRouter, 'useLocation').mockReturnValue({
        pathname: Route.Home,
        search: '',
        hash: '',
        state: null,
        key: '',
      })
    })

    it('should render the button as disabled', () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should not navigate when clicked', () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('When on the Grocery List page', () => {
    beforeEach(() => {
      vi.spyOn(ReactRouter, 'useLocation').mockReturnValue({
        pathname: Route.GroceryList,
        search: '',
        hash: '',
        state: null,
        key: '',
      })
    })

    it('should render the button as enabled', () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })

    it('should navigate to Add Grocery Item route when clicked', () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockNavigate).toHaveBeenCalledWith(Route.AddGroceryItem)
    })
  })

  describe('When on the Planner page', () => {
    beforeEach(() => {
      vi.spyOn(ReactRouter, 'useLocation').mockReturnValue({
        pathname: Route.Planner,
        search: '',
        hash: '',
        state: null,
        key: '',
      })
    })

    it('should render the button as enabled', () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })

    it('should navigate to Add Planner Item route when clicked', () => {
      renderWithProviders(<AddItemButton />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockNavigate).toHaveBeenCalledWith(Route.AddPlannerItem)
    })
  })

  describe('When on the Noise Tracking page', () => {
    beforeEach(() => {
      vi.spyOn(ReactRouter, 'useLocation').mockReturnValue({
        pathname: Route.NoiseTracking,
        search: '',
        hash: '',
        state: null,
        key: '',
      })
      
      mockAddNoiseTrackingItem.mockResolvedValue(undefined)
    })

    it('should render the button as enabled', () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })

    it('should add noise tracking item and refetch when clicked', async () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockAddNoiseTrackingItem).toHaveBeenCalled()
      
      await waitFor(() => {
        expect(mockRefetchNoiseTrackingItems).toHaveBeenCalled()
      })
      
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockAddNoiseTrackingItem.mockRejectedValue(new Error('API Error'))
      
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockAddNoiseTrackingItem).toHaveBeenCalled()
      
      // Should not crash and should not call refetch on error
      await waitFor(() => {
        expect(mockRefetchNoiseTrackingItems).not.toHaveBeenCalled()
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('When on an unknown route', () => {
    beforeEach(() => {
      vi.spyOn(ReactRouter, 'useLocation').mockReturnValue({
        pathname: '/unknown-route' as Route,
        search: '',
        hash: '',
        state: null,
        key: '',
      })
    })

    it('should render the button as enabled', () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })

    it('should not navigate when clicked', () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('Throttling behavior', () => {
    beforeEach(() => {
      vi.spyOn(ReactRouter, 'useLocation').mockReturnValue({
        pathname: Route.GroceryList,
        search: '',
        hash: '',
        state: null,
        key: '',
      })
    })

    it('should throttle multiple quick clicks', async () => {
      vi.useFakeTimers()
      
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      
      // Click multiple times quickly
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      // Should only navigate once
      expect(mockNavigate).toHaveBeenCalledTimes(1)
      
      // Wait for throttle to reset
      vi.advanceTimersByTime(1000)
      
      // Click again
      fireEvent.click(button)
      
      // Should navigate again
      expect(mockNavigate).toHaveBeenCalledTimes(2)
      
      vi.useRealTimers()
    })
  })

  it('should render the Add Circle icon', () => {
    vi.spyOn(ReactRouter, 'useLocation').mockReturnValue({
      pathname: Route.GroceryList,
      search: '',
      hash: '',
      state: null,
      key: '',
    })
    
    renderWithProviders(<AddItemButton />)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    
    // Check for the icon (MUI icons render as SVG)
    const icon = button.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })
})