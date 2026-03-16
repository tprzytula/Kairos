import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../../../theme'
import { PlannerSection } from './index'
import { ITodoItem } from '../../../../api/toDoList/retrieve/types'
import { IToDoStats } from '../../../../hooks/useHomeData/types'
import { IBirthdayItem } from '../../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../../types/mealPlan'
import { MealType } from '../../../../enums/mealType'

const createMockTodoItem = (overrides: Partial<ITodoItem> = {}): ITodoItem => ({
  id: 'todo-1',
  name: 'Test Task',
  description: 'Test description',
  isDone: false,
  dueDate: undefined,
  ...overrides
})

const createMockToDoStats = (overrides: Partial<IToDoStats> = {}): IToDoStats => ({
  pendingItems: [],
  sortedItems: [],
  displayedItems: [],
  hasMoreItems: false,
  ...overrides
})

const createMockBirthday = (overrides: Partial<IBirthdayItem> = {}): IBirthdayItem => ({
  id: 'birthday-1',
  name: 'Alice',
  month: 6,
  day: 15,
  ...overrides
})

const createMockMealPlan = (overrides: Partial<IMealPlan> = {}): IMealPlan => ({
  id: 'meal-1',
  projectId: 'project-1',
  date: '2024-01-15',
  recipeName: 'Pasta',
  createdAt: '',
  updatedAt: '',
  ...overrides
})

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

const defaultProps = {
  toDoStats: createMockToDoStats(),
  birthdays: [],
  todayMeals: [],
  isLoading: false,
  isExpanded: false,
  expandedItems: new Set<string>(),
  onToggleExpansion: jest.fn(),
  onItemToggle: jest.fn(),
}

describe('PlannerSection component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('card titles', () => {
    it('should render three section cards', () => {
      renderWithTheme(<PlannerSection {...defaultProps} />)

      expect(screen.getByText("Today's Tasks")).toBeInTheDocument()
      expect(screen.getByText('No meal planned')).toBeInTheDocument()
      expect(screen.getByText('Birthdays')).toBeInTheDocument()
    })
  })

  describe('Today\'s Tasks card', () => {
    it('should show empty state when no tasks for today', () => {
      renderWithTheme(<PlannerSection {...defaultProps} />)

      expect(screen.getByText('No tasks for today')).toBeInTheDocument()
    })

    it('should show tasks due today', () => {
      const todayDate = new Date('2024-01-15T15:00:00Z').getTime()
      const item = createMockTodoItem({ id: '1', name: 'Today Task', dueDate: todayDate })
      const toDoStats = createMockToDoStats({ sortedItems: [item] })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} />)

      expect(screen.getByText('Today Task')).toBeInTheDocument()
    })

    it('should show overdue badge when there are overdue tasks', () => {
      const pastDate = new Date('2024-01-10T12:00:00Z').getTime()
      const item = createMockTodoItem({ id: '1', name: 'Old Task', dueDate: pastDate })
      const toDoStats = createMockToDoStats({ sortedItems: [item] })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} />)

      expect(screen.getByText('1 overdue')).toBeInTheDocument()
    })

    it('should not show tasks due in the future in Today card', () => {
      const futureDate = new Date('2024-01-20T12:00:00Z').getTime()
      const item = createMockTodoItem({ id: '1', name: 'Future Task', dueDate: futureDate })
      const toDoStats = createMockToDoStats({ sortedItems: [item] })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} />)

      expect(screen.queryByText('Future Task')).not.toBeInTheDocument()
      expect(screen.getByText('No tasks for today')).toBeInTheDocument()
    })

    it('should show +N more when more than 3 tasks today', () => {
      const todayDate = new Date('2024-01-15T15:00:00Z').getTime()
      const items = Array.from({ length: 5 }, (_, i) =>
        createMockTodoItem({ id: `${i}`, name: `Task ${i}`, dueDate: todayDate + i * 1000 })
      )
      const toDoStats = createMockToDoStats({ sortedItems: items })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} />)

      expect(screen.getByText('+2 more')).toBeInTheDocument()
    })
  })

  describe('Today\'s Meals card', () => {
    it('should show empty state when no meal planned today', () => {
      renderWithTheme(<PlannerSection {...defaultProps} />)

      expect(screen.getByText('No meal planned')).toBeInTheDocument()
    })

    it('should show today\'s meal name', () => {
      const meal = createMockMealPlan({ recipeName: 'Chicken Alfredo' })

      renderWithTheme(<PlannerSection {...defaultProps} todayMeals={[meal]} />)

      expect(screen.getByText('Chicken Alfredo')).toBeInTheDocument()
    })

    it('should show the specific meal type label instead of generic Meal', () => {
      const meal = createMockMealPlan({ recipeName: 'Eggs Benedict', mealType: MealType.Breakfast })

      renderWithTheme(<PlannerSection {...defaultProps} todayMeals={[meal]} />)

      expect(screen.getByText('Breakfast')).toBeInTheDocument()
    })

    it('should show Meal as fallback label when no meal type is set', () => {
      const meal = createMockMealPlan({ recipeName: 'Chicken Alfredo' })

      renderWithTheme(<PlannerSection {...defaultProps} todayMeals={[meal]} />)

      expect(screen.getByText('Meal')).toBeInTheDocument()
    })

    it('should show all meals in the carousel when there are multiple meals', () => {
      const meals = [
        createMockMealPlan({ id: '1', recipeName: 'Breakfast Dish' }),
        createMockMealPlan({ id: '2', recipeName: 'Lunch Dish' }),
        createMockMealPlan({ id: '3', recipeName: 'Dinner Dish' }),
      ]

      renderWithTheme(<PlannerSection {...defaultProps} todayMeals={meals} />)

      expect(screen.getByText('Breakfast Dish')).toBeInTheDocument()
      expect(screen.getByText('Lunch Dish')).toBeInTheDocument()
      expect(screen.getByText('Dinner Dish')).toBeInTheDocument()
    })
  })

  describe('Birthdays card', () => {
    it('should show empty state when no birthdays saved', () => {
      renderWithTheme(<PlannerSection {...defaultProps} />)

      expect(screen.getByText('No birthdays saved')).toBeInTheDocument()
    })

    it('should show upcoming birthday names', () => {
      const birthday = createMockBirthday({ id: '1', name: 'Bob', month: 2, day: 1 })

      renderWithTheme(<PlannerSection {...defaultProps} birthdays={[birthday]} />)

      expect(screen.getByText('Bob')).toBeInTheDocument()
    })

    it('should show "Today!" for a birthday today', () => {
      // System time is 2024-01-15
      const birthday = createMockBirthday({ id: '1', name: 'Charlie', month: 1, day: 15 })

      renderWithTheme(<PlannerSection {...defaultProps} birthdays={[birthday]} />)

      expect(screen.getByText('Today!')).toBeInTheDocument()
    })

    it('should show "Tomorrow" for a birthday tomorrow', () => {
      // System time is 2024-01-15
      const birthday = createMockBirthday({ id: '1', name: 'Diana', month: 1, day: 16 })

      renderWithTheme(<PlannerSection {...defaultProps} birthdays={[birthday]} />)

      expect(screen.getByText('Tomorrow')).toBeInTheDocument()
    })

    it('should show days until for a birthday in the future', () => {
      // System time is 2024-01-15
      const birthday = createMockBirthday({ id: '1', name: 'Eve', month: 1, day: 25 })

      renderWithTheme(<PlannerSection {...defaultProps} birthdays={[birthday]} />)

      expect(screen.getByText('in 10d')).toBeInTheDocument()
    })

    it('should show only the next 3 upcoming birthdays', () => {
      const birthdays = [
        createMockBirthday({ id: '1', name: 'Person 1', month: 1, day: 16 }),
        createMockBirthday({ id: '2', name: 'Person 2', month: 1, day: 17 }),
        createMockBirthday({ id: '3', name: 'Person 3', month: 1, day: 18 }),
        createMockBirthday({ id: '4', name: 'Person 4', month: 1, day: 19 }),
      ]

      renderWithTheme(<PlannerSection {...defaultProps} birthdays={birthdays} />)

      expect(screen.getByText('Person 1')).toBeInTheDocument()
      expect(screen.getByText('Person 2')).toBeInTheDocument()
      expect(screen.getByText('Person 3')).toBeInTheDocument()
      expect(screen.queryByText('Person 4')).not.toBeInTheDocument()
    })
  })
})
