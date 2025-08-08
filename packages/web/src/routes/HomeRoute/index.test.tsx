import { act, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import HomeRoute from '.'
import * as GroceryAPI from '../../api/groceryList'
import * as ToDoAPI from '../../api/toDoList'
import * as NoiseAPI from '../../api/noiseTracking'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { useAppState } from '../../providers/AppStateProvider'

jest.mock('../../providers/AppStateProvider', () => ({
  ...jest.requireActual('../../providers/AppStateProvider'),
  useAppState: jest.fn(),
}))

jest.mock('../../api/groceryList')
jest.mock('../../api/toDoList')
jest.mock('../../api/noiseTracking')
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => jest.fn()),
}))

describe('Given the HomeRoute component', () => {
  beforeEach(() => {
    jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])
    jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])
  })

  it('should retrieve all lists', async () => {
    const groceryListSpy = jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
    const toDoListSpy = jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])
    const noiseListSpy = jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(groceryListSpy).toHaveBeenCalled()
    expect(toDoListSpy).toHaveBeenCalled()
    expect(noiseListSpy).toHaveBeenCalled()
  })

  it('should display section headers', async () => {
    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Grocery List')).toBeVisible()
      expect(screen.getByText('To-Do Items')).toBeVisible()
      expect(screen.getByText('Noise Recordings')).toBeVisible()
    })
  })

  it('should display empty states when all lists are empty', async () => {
    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('No grocery items found')).toBeVisible()
      expect(screen.getByText('No pending to-do items found')).toBeVisible()
      expect(screen.getByText('No noise recordings found')).toBeVisible()
    })
  })

  it('should display grocery items as image grid', async () => {
    const mockGroceryList = [
      { id: '1', name: 'Milk', quantity: 1, unit: GroceryItemUnit.LITER, imagePath: 'https://hostname.com/image.png', toBeRemoved: false },
      { id: '2', name: 'Bread', quantity: 2, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false },
      { id: '3', name: 'Eggs', quantity: 12, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false },
      { id: '4', name: 'Butter', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false },
      { id: '5', name: 'Cheese', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false },
    ]

    jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue(mockGroceryList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByTitle('Cheese (1 unit(s))')).toBeVisible()
      expect(screen.getByTitle('Butter (1 unit(s))')).toBeVisible()
      expect(screen.getByTitle('Eggs (12 unit(s))')).toBeVisible()
      expect(screen.getByTitle('Bread (2 unit(s))')).toBeVisible()
      expect(screen.getByTitle('Milk (1 l)')).toBeVisible()
    })
  })

  it('should display top three pending to-do items sorted by due date', async () => {
    const now = Date.now()
    const mockToDoList = [
      { id: '1', name: 'Completed Task', description: 'Done', isDone: true, dueDate: now + 86400000 },
      { id: '2', name: 'Task 1', description: 'Description 1', isDone: false, dueDate: now + 4 * 86400000 }, // 4 days from now
      { id: '3', name: 'Task 2', description: 'Description 2', isDone: false, dueDate: now + 2 * 86400000 }, // 2 days from now  
      { id: '4', name: 'Task 3', description: 'Description 3', isDone: false, dueDate: now + 86400000 }, // 1 day from now
      { id: '5', name: 'Task 4', description: 'Description 4', isDone: false, dueDate: now + 3 * 86400000 }, // 3 days from now
    ]

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockToDoList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      // Should show tasks sorted by earliest due date first (Task 3, Task 2, Task 4)
      expect(screen.getByText('Task 3')).toBeVisible() // Due tomorrow  
      expect(screen.getByText('Task 2')).toBeVisible() // Due in 2 days
      expect(screen.getByText('Task 4')).toBeVisible() // Due in 3 days
      expect(screen.getByText('+1 more items')).toBeVisible() // Task 1 is not shown
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument() // Task 1 due later not shown
      expect(screen.queryByText('Completed Task')).not.toBeInTheDocument()
    })
  })

  it('should display to-do items with descriptions', async () => {
    const mockToDoList = [
      { id: '1', name: 'Buy groceries', description: 'Milk and bread', isDone: false },
    ]

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockToDoList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeVisible()
      expect(screen.getByText('Milk and bread')).toBeVisible()
    })
  })

  it('should display noise recordings as aggregated stats', async () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000)

    const mockNoiseList = [
      { timestamp: today.getTime() + 2 * 60 * 60 * 1000 }, // Today
      { timestamp: today.getTime() + 4 * 60 * 60 * 1000 }, // Today  
      { timestamp: yesterday.getTime() }, // Yesterday (last 7 days)
      { timestamp: weekAgo.getTime() }, // Week ago (last 30 days)
    ]

    jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue(mockNoiseList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeVisible()
      expect(screen.getByText('Last 7 days')).toBeVisible() 
      expect(screen.getByText('Last 30 days')).toBeVisible()
      
      // Check the specific blocks have the correct counts
      const todayBlock = screen.getByText('Today').closest('.css-mew3oe')
      const sevenDaysBlock = screen.getByText('Last 7 days').closest('.css-mew3oe')
      const thirtyDaysBlock = screen.getByText('Last 30 days').closest('.css-mew3oe')
      
      expect(todayBlock).toHaveTextContent('2')
      expect(sevenDaysBlock).toHaveTextContent('3')
      expect(thirtyDaysBlock).toHaveTextContent('4')
    })
  })

  describe('When API calls fail', () => {
    it('should display error messages in console', async () => {
      const errorSpy = jest.spyOn(console, 'error')

      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockRejectedValue(new Error('Grocery API failed'))
      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockRejectedValue(new Error('ToDo API failed'))
      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockRejectedValue(new Error('Noise API failed'))

      await act(async () => {
        renderComponent()
      })

      expect(errorSpy).toHaveBeenCalledWith('Failed to fetch grocery list:', new Error('Grocery API failed'))
      expect(errorSpy).toHaveBeenCalledWith('Failed to fetch to do list:', new Error('ToDo API failed'))
      expect(errorSpy).toHaveBeenCalledWith('Failed to fetch noise tracking items:', new Error('Noise API failed'))
    })
  })
})

const renderComponent = () => {
  jest.mocked(useAppState).mockReturnValue({
    state: {
      ...initialState,
    },
    dispatch: jest.fn(),
  })

  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <HomeRoute />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
} 