import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../../../theme'
import { PlannerSection } from './index'
import { ITodoItem } from '../../../../api/toDoList/retrieve/types'
import { IToDoStats } from '../../../../hooks/useHomeData/types'
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
  todayMeals: [],
  isLoading: false,
  onStepToggle: jest.fn(),
  onCardClick: jest.fn(),
}

describe('PlannerSection component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('section layout', () => {
    it('should render Tasks section and meal card', () => {
      renderWithTheme(<PlannerSection {...defaultProps} />)

      expect(screen.getByText('Tasks')).toBeInTheDocument()
      expect(screen.getByText('No meal planned')).toBeInTheDocument()
    })
  })

  describe('Tasks section', () => {
    it('should show empty state when no tasks', () => {
      renderWithTheme(<PlannerSection {...defaultProps} />)

      expect(screen.getByText('No tasks planned — enjoy the day!')).toBeInTheDocument()
    })

    it('should show task names from sorted items', () => {
      const todayDate = new Date('2024-01-15T15:00:00Z').getTime()
      const item = createMockTodoItem({ id: '1', name: 'Visit the forest', dueDate: todayDate })
      const toDoStats = createMockToDoStats({ sortedItems: [item], pendingItems: [item] })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} />)

      expect(screen.getByText('Visit the forest')).toBeInTheDocument()
    })

    it('should show subtask progress bar and step count', () => {
      const item = createMockTodoItem({
        id: '1',
        name: 'Trip',
        dueDate: new Date('2024-01-16T12:00:00Z').getTime(),
        steps: [
          { id: 's1', name: 'Pack clothes', isDone: true },
          { id: 's2', name: 'Buy tickets', isDone: false },
          { id: 's3', name: 'Buy snacks', isDone: false },
        ],
      })
      const toDoStats = createMockToDoStats({ sortedItems: [item], pendingItems: [item] })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} />)

      expect(screen.getByText('1/3 steps')).toBeInTheDocument()
      // Steps are collapsed by default — expand to see them
      fireEvent.click(screen.getByText('1/3 steps'))
      expect(screen.getByText('Pack clothes')).toBeInTheDocument()
      expect(screen.getByText('Buy tickets')).toBeInTheDocument()
      expect(screen.getByText('Buy snacks')).toBeInTheDocument()
    })

    it('should call onStepToggle when a step is clicked', () => {
      const onStepToggle = jest.fn()
      const item = createMockTodoItem({
        id: '1',
        name: 'Trip',
        steps: [
          { id: 's1', name: 'Pack clothes', isDone: false },
        ],
      })
      const toDoStats = createMockToDoStats({ sortedItems: [item], pendingItems: [item] })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} onStepToggle={onStepToggle} />)

      // Steps are collapsed by default — expand first
      fireEvent.click(screen.getByText('0/1 steps'))
      fireEvent.click(screen.getByText('Pack clothes'))

      expect(onStepToggle).toHaveBeenCalledWith('1', 's1', true)
    })

    it('should call onCardClick when a task header is clicked', () => {
      const onCardClick = jest.fn()
      const item = createMockTodoItem({ id: '1', name: 'My Task' })
      const toDoStats = createMockToDoStats({ sortedItems: [item], pendingItems: [item] })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} onCardClick={onCardClick} />)

      fireEvent.click(screen.getByText('My Task'))

      expect(onCardClick).toHaveBeenCalledWith(item)
    })

    it('should show expand button when more than 2 tasks', () => {
      const items = Array.from({ length: 4 }, (_, i) =>
        createMockTodoItem({ id: `${i}`, name: `Task ${i}` })
      )
      const toDoStats = createMockToDoStats({ sortedItems: items, pendingItems: items })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} />)

      expect(screen.getByText('2 more tasks')).toBeInTheDocument()
      // Only first 2 visible by default
      expect(screen.getByText('Task 0')).toBeInTheDocument()
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })

    it('should show pending items count badge', () => {
      const items = [
        createMockTodoItem({ id: '1', name: 'Task 1' }),
        createMockTodoItem({ id: '2', name: 'Task 2' }),
      ]
      const toDoStats = createMockToDoStats({ sortedItems: items, pendingItems: items })

      renderWithTheme(<PlannerSection {...defaultProps} toDoStats={toDoStats} />)

      expect(screen.getByText('2')).toBeInTheDocument()
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

      expect(screen.getByText('Today · Breakfast')).toBeInTheDocument()
    })

    it('should show Meal as fallback label when no meal type is set', () => {
      const meal = createMockMealPlan({ recipeName: 'Chicken Alfredo' })

      renderWithTheme(<PlannerSection {...defaultProps} todayMeals={[meal]} />)

      expect(screen.getByText('Today')).toBeInTheDocument()
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

})
