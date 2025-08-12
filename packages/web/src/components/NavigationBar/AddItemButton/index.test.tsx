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
const mockNavigate = jest.fn()
const mockRefetchNoiseTrackingItems = jest.fn()
const mockAddNoiseTrackingItem = jest.fn()

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
}))

jest.mock('../../../providers/NoiseTrackingProvider')
jest.mock('../../../api/noiseTracking')

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
    jest.clearAllMocks()
    
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [],
      isLoading: false,
      refetchNoiseTrackingItems: mockRefetchNoiseTrackingItems,
    })
    
    jest.spyOn(NoiseTrackingAPI, 'addNoiseTrackingItem').mockImplementation(mockAddNoiseTrackingItem)
  })

  describe('When on the Home page', () => {
    beforeEach(() => {
      jest.spyOn(ReactRouter, 'useLocation').mockReturnValue({
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
      jest.spyOn(ReactRouter, 'useLocation').mockReturnValue({
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

  describe('When on the To-Do List page', () => {
    beforeEach(() => {
      jest.spyOn(ReactRouter, 'useLocation').mockReturnValue({
        pathname: Route.ToDoList,
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

    it('should navigate to Add To-Do Item route when clicked', () => {
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockNavigate).toHaveBeenCalledWith(Route.AddToDoItem)
    })
  })

  describe('When on the Noise Tracking page', () => {
    beforeEach(() => {
      jest.spyOn(ReactRouter, 'useLocation').mockReturnValue({
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
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
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
      jest.spyOn(ReactRouter, 'useLocation').mockReturnValue({
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
      jest.spyOn(ReactRouter, 'useLocation').mockReturnValue({
        pathname: Route.GroceryList,
        search: '',
        hash: '',
        state: null,
        key: '',
      })
    })

    it('should throttle multiple quick clicks', async () => {
      jest.useFakeTimers()
      
      renderWithProviders(<AddItemButton />)
      
      const button = screen.getByRole('button')
      
      // Click multiple times quickly
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      // Should only navigate once
      expect(mockNavigate).toHaveBeenCalledTimes(1)
      
      // Wait for throttle to reset
      jest.advanceTimersByTime(1000)
      
      // Click again
      fireEvent.click(button)
      
      // Should navigate again
      expect(mockNavigate).toHaveBeenCalledTimes(2)
      
      jest.useRealTimers()
    })
  })

  it('should render the Add Circle icon', () => {
    jest.spyOn(ReactRouter, 'useLocation').mockReturnValue({
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