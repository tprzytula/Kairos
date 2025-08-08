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
  useNavigate: jest.fn(),
}))

describe('Given the HomeRoute component', () => {
  beforeEach(() => {
    jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])
    jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])
  })

  it('should have the correct title', async () => {
    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('Home')).toBeVisible()
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
      expect(screen.getByText('Recent To-Do Items')).toBeVisible()
      expect(screen.getByText('Recent Noise Recordings')).toBeVisible()
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

  it('should display last two pending to-do items', async () => {
    const mockToDoList = [
      { id: '1', name: 'Completed Task', description: 'Done', isDone: true },
      { id: '2', name: 'Task 1', description: 'Description 1', isDone: false },
      { id: '3', name: 'Task 2', description: 'Description 2', isDone: false },
      { id: '4', name: 'Task 3', description: 'Description 3', isDone: false },
      { id: '5', name: 'Task 4', description: 'Description 4', isDone: false },
    ]

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockToDoList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Task 4')).toBeVisible()
      expect(screen.getByText('Task 3')).toBeVisible()
      expect(screen.getByText('Task 2')).toBeVisible()
      expect(screen.getByText('Task 1')).toBeVisible()
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

  it('should display last three noise recordings with time elapsed', async () => {
    const baseTime = 1700000000000
    const mockNoiseList = [
      { timestamp: baseTime },
      { timestamp: baseTime + 300000 },
      { timestamp: baseTime + 900000 },
      { timestamp: baseTime + 1800000 },
      { timestamp: baseTime + 3600000 },
    ]

    jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue(mockNoiseList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('30 minutes later')).toBeVisible()
      expect(screen.getByText('15 minutes later')).toBeVisible()
      expect(screen.getByText('10 minutes later')).toBeVisible()
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