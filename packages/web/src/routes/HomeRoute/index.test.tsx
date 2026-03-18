import { act, render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })
import HomeRoute from '.'
import * as GroceryAPI from '../../api/groceryList'
import * as ToDoAPI from '../../api/toDoList'
import * as NoiseAPI from '../../api/noiseTracking'
import * as BirthdayAPI from '../../api/birthdays/retrieve'
import * as MealPlanAPI from '../../api/mealPlans'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { useAppState } from '../../providers/AppStateProvider'
import { ProjectProvider, useProjectContext } from '../../providers/ProjectProvider'
import { IProject, ProjectRole } from '../../types/project'

jest.mock('../../providers/AppStateProvider', () => ({
  AppStateProvider: ({ children }: any) => children,
  AppState: { Provider: ({ children }: any) => children, Consumer: jest.fn() },
  initialState: {
    alerts: new Map(),
    purchasedItems: new Set(),
    selectedTodoItems: new Set(),
    selectedCalendarDate: null,
  },
  useAppState: jest.fn(),
}))

jest.mock('../../providers/ProjectProvider', () => ({
  ProjectProvider: ({ children }: any) => children,
  ProjectContext: { Provider: ({ children }: any) => children, Consumer: jest.fn() },
  useProjectContext: jest.fn(),
}))

jest.mock('../../api/groceryList', () => ({
  retrieveGroceryList: jest.fn(),
  addGroceryItem: jest.fn(),
  removeGroceryItems: jest.fn(),
  updateGroceryItem: jest.fn(),
  updateGroceryItemFields: jest.fn(),
  retrieveGroceryListDefaults: jest.fn(),
  addGroceryItemDefault: jest.fn(),
  updateGroceryItemDefault: jest.fn(),
  deleteGroceryItemDefault: jest.fn(),
  getGroceryDefaultUploadUrl: jest.fn(),
}))
jest.mock('../../api/toDoList', () => ({
  retrieveToDoList: jest.fn(),
  addTodoItem: jest.fn(),
  removeTodoItems: jest.fn(),
  updateToDoItems: jest.fn(),
  updateToDoItemFields: jest.fn(),
}))
jest.mock('../../api/noiseTracking', () => ({
  retrieveNoiseTrackingItems: jest.fn(),
  addNoiseTrackingItem: jest.fn(),
  removeNoiseTrackingItem: jest.fn(),
}))
jest.mock('../../api/birthdays/retrieve', () => ({
  retrieveBirthdays: jest.fn(),
}))
jest.mock('../../api/mealPlans', () => ({
  getMealPlans: jest.fn(),
  addMealPlan: jest.fn(),
  updateMealPlan: jest.fn(),
  deleteMealPlan: jest.fn(),
}))
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => jest.fn()),
}))

// Mock the useAuth hook for DashboardHeader and ProjectProvider
jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(() => ({
    user: { access_token: 'mock-access-token' },
    isAuthenticated: true,
    isLoading: false,
    error: null
  }))
}))

const mockUseProjectContext = useProjectContext as jest.MockedFunction<typeof useProjectContext>

const MOCK_PROJECT: IProject = {
  id: 'test-project-id',
  ownerId: 'test-user-id',
  name: 'Test Project',
  isPersonal: false,
  maxMembers: 10,
  inviteCode: 'test-invite',
  createdAt: new Date().toISOString(),
}

describe('Given the HomeRoute component', () => {
  beforeEach(() => {
    mockUseProjectContext.mockReturnValue({
      projects: [MOCK_PROJECT],
      currentProject: MOCK_PROJECT,
      isLoading: false,
      fetchProjects: jest.fn(),
      createProject: jest.fn(),
      joinProject: jest.fn(),
      switchProject: jest.fn(),
      getProjectInviteInfo: jest.fn(),
    })
    
    jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])
    jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])
    jest.spyOn(BirthdayAPI, 'retrieveBirthdays').mockResolvedValue([])
    jest.spyOn(MealPlanAPI, 'getMealPlans').mockResolvedValue([])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should retrieve all lists', async () => {
    const groceryListSpy = jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
    const toDoListSpy = jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])
    const noiseListSpy = jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(groceryListSpy).toHaveBeenCalledWith('test-project-id', undefined)
    expect(toDoListSpy).toHaveBeenCalledWith('test-project-id')
    expect(noiseListSpy).toHaveBeenCalledWith('test-project-id')
  })

  it('should display section headers', async () => {
    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Grocery List')).toBeVisible()
      expect(screen.getByText("Today's Tasks")).toBeVisible()
      expect(screen.getByText('No meal planned')).toBeVisible()
      expect(screen.getByText('Birthdays')).toBeVisible()
      expect(screen.getByText('Noise Recordings')).toBeVisible()
    })
  })

  it('should display empty states when all lists are empty', async () => {
    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('No grocery items found')).toBeVisible()
      expect(screen.getByText('No tasks for today')).toBeVisible()
      expect(screen.getAllByText('No meal planned')[0]).toBeVisible()
      expect(screen.getByText('No birthdays saved')).toBeVisible()
      expect(screen.getByText('No noise recordings found')).toBeVisible()
    })
  })

  it('should display grocery items as image grid', async () => {
    const mockGroceryList = [
      { id: '1', name: 'Milk', quantity: 1, unit: GroceryItemUnit.LITER, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
      { id: '2', name: 'Bread', quantity: 2, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
      { id: '3', name: 'Eggs', quantity: 12, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
      { id: '4', name: 'Butter', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
      { id: '5', name: 'Cheese', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
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

  describe('Noise recordings layout behavior', () => {
    it('should not render grid layout when no noise recordings exist', async () => {
      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])
      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        const emptyNoiseText = screen.getByText('No noise recordings found')
        expect(emptyNoiseText).toBeVisible()
        
        const noiseStatsGrids = document.querySelectorAll('.css-1u2p3w7')
        expect(noiseStatsGrids).toHaveLength(0)
      })
    })

    it('should render grid layout when noise recordings exist', async () => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      const mockNoiseList = [
        { timestamp: today.getTime() + 2 * 60 * 60 * 1000 }
      ]

      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue(mockNoiseList)
      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.getByText('Today')).toBeVisible()
        expect(screen.getByText('Last 7 days')).toBeVisible() 
        expect(screen.getByText('Last 30 days')).toBeVisible()
        
        expect(screen.queryByText('No noise recordings found')).not.toBeInTheDocument()
      })
    })
  })

  describe('Grocery grid layout behavior', () => {
    it('should display 3 grocery items when 3 items provided', async () => {
      const mockGroceryList = [
        { id: '1', name: 'Item 1', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
        { id: '2', name: 'Item 2', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
        { id: '3', name: 'Item 3', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
      ]

      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue(mockGroceryList)

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.getByTitle('Item 1 (1 unit(s))')).toBeVisible()
        expect(screen.getByTitle('Item 2 (1 unit(s))')).toBeVisible()
        expect(screen.getByTitle('Item 3 (1 unit(s))')).toBeVisible()
        
        const itemCount = screen.getByText('3')
        expect(itemCount).toBeVisible()
      })
    })

    it('should display 7 grocery items when 7 items provided', async () => {
      const mockGroceryList = [
        { id: '1', name: 'Item 1', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
        { id: '2', name: 'Item 2', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
        { id: '3', name: 'Item 3', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
        { id: '4', name: 'Item 4', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
        { id: '5', name: 'Item 5', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
        { id: '6', name: 'Item 6', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
        { id: '7', name: 'Item 7', quantity: 1, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', toBeRemoved: false, shopId: 'test-shop-1' },
      ]

      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue(mockGroceryList)

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.getByTitle('Item 1 (1 unit(s))')).toBeVisible()
        expect(screen.getByTitle('Item 2 (1 unit(s))')).toBeVisible()
        expect(screen.getByTitle('Item 3 (1 unit(s))')).toBeVisible()
        expect(screen.getByTitle('Item 4 (1 unit(s))')).toBeVisible()
        expect(screen.getByTitle('Item 5 (1 unit(s))')).toBeVisible()
        expect(screen.getByTitle('Item 6 (1 unit(s))')).toBeVisible()
        expect(screen.getByTitle('Item 7 (1 unit(s))')).toBeVisible()
        
        const itemCount = screen.getByText('7')
        expect(itemCount).toBeVisible()
      })
    })

    it('should display maximum 9 items plus overflow indicator when more than 10 items', async () => {
      const mockGroceryList = Array.from({ length: 15 }, (_, index) => ({
        id: `${index + 1}`,
        name: `Item ${index + 1}`,
        quantity: 1,
        unit: GroceryItemUnit.UNIT,
        imagePath: 'https://hostname.com/image.png',
        toBeRemoved: false,
        shopId: 'test-shop-1',
      }))

      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue(mockGroceryList)

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.getByTitle('Item 1 (1 unit(s))')).toBeVisible()
        expect(screen.getByTitle('Item 9 (1 unit(s))')).toBeVisible()
        expect(screen.queryByTitle('Item 10 (1 unit(s))')).not.toBeInTheDocument()
        
        expect(screen.getByText('+6')).toBeVisible()
        
        const itemCount = screen.getByText('15')
        expect(itemCount).toBeVisible()
      })
    })
  })

  it('should display tasks due today in the Today\'s Tasks card', async () => {
    const now = new Date()
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const mockToDoList = [
      { id: '1', name: 'Completed Task', isDone: true, dueDate: todayMidnight.getTime() + 2 * 3600000 },
      { id: '2', name: 'Today Task', isDone: false, dueDate: todayMidnight.getTime() + 3 * 3600000 },
      { id: '3', name: 'Future Task', isDone: false, dueDate: todayMidnight.getTime() + 2 * 86400000 },
    ]

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockToDoList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      const todaySlide = screen.getByTestId('today-tasks-slide')
      expect(within(todaySlide).getByText('Today Task')).toBeInTheDocument()
      expect(within(todaySlide).queryByText('Future Task')).not.toBeInTheDocument()
      expect(within(todaySlide).queryByText('Completed Task')).not.toBeInTheDocument()
    })
  })

  it('should display today\'s meal from meal plan', async () => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

    jest.spyOn(MealPlanAPI, 'getMealPlans').mockResolvedValue([
      { id: '1', projectId: 'test-project-id', date: todayStr, recipeName: 'Spaghetti Bolognese', createdAt: '', updatedAt: '' }
    ])

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Spaghetti Bolognese')).toBeVisible()
    })
  })

  it('should allow switching between grocery items without closing popup', async () => {
    const mockGroceryList = [
      { id: '1', name: 'Apple', quantity: 5, unit: GroceryItemUnit.UNIT, imagePath: '/apple.png', shopId: 'test-shop-1' },
      { id: '2', name: 'Banana', quantity: 3, unit: GroceryItemUnit.UNIT, imagePath: '/banana.png', shopId: 'test-shop-1' },
    ]

    jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue(mockGroceryList)

    await act(async () => {
      renderComponent()
    })

    // Click first grocery item
    await waitFor(() => {
      expect(screen.queryByTitle('Apple (5 unit(s))')).toBeInTheDocument()
    })
    const firstIcon = screen.getByTitle('Apple (5 unit(s))')
    await act(async () => {
      fireEvent.click(firstIcon)
    })

    // Should show first item popup
    await waitFor(() => {
      expect(document.body.querySelector('[role="tooltip"]')).toBeInTheDocument()
      expect(screen.getByText('Apple')).toBeVisible()
      expect(screen.getByText('5 unit(s)')).toBeVisible()
    })

    // Click second grocery item directly (without closing first)
    const secondIcon = screen.getByTitle('Banana (3 unit(s))')
    await act(async () => {
      fireEvent.click(secondIcon)
    })

    // Should now show second item popup (switched directly)
    await waitFor(() => {
      expect(document.body.querySelector('[role="tooltip"]')).toBeInTheDocument()
      expect(screen.getByText('Banana')).toBeVisible()
      expect(screen.getByText('3 unit(s)')).toBeVisible()
      // First item should no longer be visible
      expect(screen.queryByText('Apple')).not.toBeInTheDocument()
      expect(screen.queryByText('5 unit(s)')).not.toBeInTheDocument()
    })
    
    // Should be able to close by clicking the bubble itself
    const bubble = document.body.querySelector('[role="tooltip"]') as HTMLElement
    await act(async () => {
      fireEvent.click(bubble)
    })

    await waitFor(() => {
      expect(document.body.querySelector('[role="tooltip"]')).not.toBeInTheDocument()
      expect(screen.queryByText('Banana')).not.toBeInTheDocument()
      expect(screen.queryByText('3 unit(s)')).not.toBeInTheDocument()
    })
  })

  it('should display upcoming birthdays in the Birthdays card', async () => {
    const today = new Date()
    const nextMonth = today.getMonth() + 2 // +1 for 0-index, +1 for next month

    jest.spyOn(BirthdayAPI, 'retrieveBirthdays').mockResolvedValue([
      { id: '1', name: 'John Doe', month: nextMonth > 12 ? nextMonth - 12 : nextMonth, day: 1 }
    ])

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeVisible()
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

      await waitFor(() => {
        expect(errorSpy).toHaveBeenCalledWith('Failed to fetch grocery list:', new Error('Grocery API failed'))
        expect(errorSpy).toHaveBeenCalledWith('Failed to fetch to do list:', new Error('ToDo API failed'))
        expect(errorSpy).toHaveBeenCalledWith('Failed to fetch noise tracking items:', new Error('Noise API failed'))
      })
    })
  })

  describe('Due date calculations', () => {
    beforeEach(() => {
      // Mock current date to a fixed value for consistent testing
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should show overdue badge for overdue items', async () => {
      const overdueItem = {
        id: '1',
        name: 'Overdue Task',
        isDone: false,
        description: 'This is overdue',
        dueDate: new Date('2024-01-10T12:00:00Z').getTime() // 5 days ago
      }

      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([overdueItem])
      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.getByText('1 overdue')).toBeInTheDocument()
      })
    })

    it('should display tasks due today in Today\'s Tasks card', async () => {
      const todayItem = {
        id: '2',
        name: 'Today Task',
        isDone: false,
        description: 'Due today',
        dueDate: new Date('2024-01-15T15:00:00Z').getTime() // Same day
      }

      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([todayItem])
      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        const todaySlide = screen.getByTestId('today-tasks-slide')
        expect(within(todaySlide).getByText('Today Task')).toBeInTheDocument()
      })
    })

    it('should not show tasks due tomorrow in Today\'s Tasks card', async () => {
      const tomorrowItem = {
        id: '3',
        name: 'Tomorrow Task',
        isDone: false,
        description: 'Due tomorrow',
        dueDate: new Date('2024-01-16T12:00:00Z').getTime() // Next day
      }

      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([tomorrowItem])
      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.queryByText('Tomorrow Task')).not.toBeInTheDocument()
        expect(screen.getByText('No tasks for today')).toBeInTheDocument()
      })
    })

    it('should not show tasks due in weeks in Today\'s Tasks card', async () => {
      const weekItem = {
        id: '4',
        name: 'Week Task',
        isDone: false,
        description: 'Due in weeks',
        dueDate: new Date('2024-01-29T12:00:00Z').getTime() // 14 days later
      }

      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([weekItem])
      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.queryByText('Week Task')).not.toBeInTheDocument()
        expect(screen.getByText('No tasks for today')).toBeInTheDocument()
      })
    })

    it('should not show tasks due in months in Today\'s Tasks card', async () => {
      const monthItem = {
        id: '5',
        name: 'Month Task',
        isDone: false,
        description: 'Due in months',
        dueDate: new Date('2024-03-15T12:00:00Z').getTime() // 60 days later
      }

      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([monthItem])
      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.queryByText('Month Task')).not.toBeInTheDocument()
        expect(screen.getByText('No tasks for today')).toBeInTheDocument()
      })
    })

    it('should handle items without due dates', async () => {
      const noDateItem = {
        id: '6',
        name: 'No Date Task',
        isDone: false,
        description: 'No due date',
        dueDate: undefined
      }

      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([noDateItem])
      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        // Tasks without due dates don't appear in Today's Tasks
        expect(screen.queryByText('No Date Task')).not.toBeInTheDocument()
        expect(screen.getByText('No tasks for today')).toBeInTheDocument()
      })
    })
  })

  describe('noise recordings sub-page navigation', () => {
    it('should navigate to noise detail views when clicking on stat blocks', async () => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      const mockNoiseList = [
        { timestamp: today.getTime() + 2 * 60 * 60 * 1000 }, // Today at 2pm
        { timestamp: today.getTime() + 4 * 60 * 60 * 1000 }, // Today at 4pm  
      ]

      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue(mockNoiseList)

      await act(async () => {
        renderComponent()
      })

      // Should show overview initially
      await waitFor(() => {
        expect(screen.getByText('Today')).toBeVisible()
        expect(screen.getByText('Last 7 days')).toBeVisible()
        expect(screen.getByText('Last 30 days')).toBeVisible()
        // Verify counts are displayed (multiple 2s will exist for different stats)
        const countElements = screen.getAllByText('2')
        expect(countElements.length).toBeGreaterThan(0)
      })

      // Click on "Today" stat block
      const todayBlock = screen.getByText('Today').closest('div')
      expect(todayBlock).not.toBeNull()
      
      await act(async () => {
        fireEvent.click(todayBlock!)
      })

      // Should show today's detail view
      await waitFor(() => {
        expect(screen.getByText('Today\'s Recordings')).toBeVisible()
        expect(screen.getByText('Back')).toBeVisible()
        expect(screen.queryByText('Last 7 days')).not.toBeInTheDocument()
        expect(screen.queryByText('Last 30 days')).not.toBeInTheDocument()
      })

      // Should show today's recordings
      await waitFor(() => {
        const todayTexts = screen.getAllByText('Today')
        expect(todayTexts.length).toBeGreaterThan(1) // Header + recordings
      })
    })

    it('should navigate back from detail view to overview', async () => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      const mockNoiseList = [
        { timestamp: today.getTime() + 2 * 60 * 60 * 1000 },
      ]

      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue(mockNoiseList)

      await act(async () => {
        renderComponent()
      })

      // Navigate to detail view
      await waitFor(() => {
        expect(screen.queryByText('Today')).toBeInTheDocument()
      })
      const todayBlock = screen.getByText('Today').closest('div')
      await act(async () => {
        fireEvent.click(todayBlock!)
      })

      await waitFor(() => {
        expect(screen.getByText('Today\'s Recordings')).toBeVisible()
      })

      // Click back button
      const backButton = screen.getByText('Back')
      await act(async () => {
        fireEvent.click(backButton)
      })

      // Should be back to overview
      await waitFor(() => {
        expect(screen.getByText('Today')).toBeVisible()
        expect(screen.getByText('Last 7 days')).toBeVisible()
        expect(screen.getByText('Last 30 days')).toBeVisible()
        expect(screen.queryByText('Today\'s Recordings')).not.toBeInTheDocument()
        expect(screen.queryByText('Back')).not.toBeInTheDocument()
      })
    })

    it('should show empty state in detail view when no recordings match filter', async () => {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
      
      const mockNoiseList = [
        { timestamp: weekAgo.getTime() }, // Outside of 7 days range
      ]

      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue(mockNoiseList)

      await act(async () => {
        renderComponent()
      })

      // Click on "Last 7 days" (should have 0 items)
      await waitFor(() => {
        expect(screen.queryByText('Last 7 days')).toBeInTheDocument()
      })
      const last7DaysBlock = screen.getByText('Last 7 days').closest('div')
      await act(async () => {
        fireEvent.click(last7DaysBlock!)
      })

      // Should show empty state
      await waitFor(() => {
        expect(screen.getByText('Last 7 Days')).toBeVisible()
        expect(screen.getByText('No recordings found for last 7 days')).toBeVisible()
      })
    })
  })

  describe('planner mini-cards data', () => {
    it('should show multiple overdue tasks as a single badge count', async () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))

      const overdueTasks = [
        { id: '1', name: 'Old Task 1', isDone: false, dueDate: new Date('2024-01-10T12:00:00Z').getTime() },
        { id: '2', name: 'Old Task 2', isDone: false, dueDate: new Date('2024-01-11T12:00:00Z').getTime() },
        { id: '3', name: 'Old Task 3', isDone: false, dueDate: new Date('2024-01-12T12:00:00Z').getTime() },
      ]

      jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(overdueTasks)
      jest.spyOn(GroceryAPI, 'retrieveGroceryList').mockResolvedValue([])
      jest.spyOn(NoiseAPI, 'retrieveNoiseTrackingItems').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.getByText('3 overdue')).toBeInTheDocument()
      })

      jest.useRealTimers()
    })

    it('should show birthday that is today', async () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))

      jest.spyOn(BirthdayAPI, 'retrieveBirthdays').mockResolvedValue([
        { id: '1', name: 'Happy Person', month: 1, day: 15 }
      ])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.getByText('Happy Person')).toBeInTheDocument()
        expect(screen.getByText('Today!')).toBeInTheDocument()
      })

      jest.useRealTimers()
    })

    it('should not show a meal for a different day', async () => {
      jest.spyOn(MealPlanAPI, 'getMealPlans').mockResolvedValue([
        { id: '1', projectId: 'test-project-id', date: '2020-01-01', recipeName: 'Old Meal', createdAt: '', updatedAt: '' }
      ])

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(screen.queryByText('Old Meal')).not.toBeInTheDocument()
        expect(screen.getAllByText('No meal planned')[0]).toBeInTheDocument()
      })
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

  const queryClient = createTestQueryClient()
  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ProjectProvider>
          <AppStateProvider>
            <BrowserRouter>
              <HomeRoute />
            </BrowserRouter>
          </AppStateProvider>
        </ProjectProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
} 