import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../../../theme'
import { PlannerSection } from './index'
import { UpcomingBirthdaysCard } from './components/UpcomingBirthdaysCard'
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
  upcomingAdventures: [],
  isLoading: false,
  isError: false,
  onStepToggle: vi.fn(),
  onCardClick: vi.fn(),
}

describe('PlannerSection component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('section layout', () => {
    it('should render Tasks section and hide meal card when no meals', () => {
      renderWithTheme(<PlannerSection {...defaultProps} />)

      expect(screen.getByText('Tasks')).toBeInTheDocument()
      expect(screen.queryByText('No meal planned')).not.toBeInTheDocument()
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

      const progressLabel = screen.getByTestId('progress-label')
      expect(progressLabel).toHaveTextContent('33% · 1/3')
      // Steps are collapsed by default — expand to see them
      fireEvent.click(progressLabel)
      expect(screen.getByText('Pack clothes')).toBeInTheDocument()
      expect(screen.getByText('Buy tickets')).toBeInTheDocument()
      expect(screen.getByText('Buy snacks')).toBeInTheDocument()
    })

    it('should call onStepToggle when a step is clicked', () => {
      const onStepToggle = vi.fn()
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
      fireEvent.click(screen.getByTestId('progress-label'))
      fireEvent.click(screen.getByText('Pack clothes'))

      expect(onStepToggle).toHaveBeenCalledWith('1', 's1', true)
    })

    it('should call onCardClick when a task header is clicked', () => {
      const onCardClick = vi.fn()
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
    it('should hide meal card when no meal planned today', () => {
      renderWithTheme(<PlannerSection {...defaultProps} />)

      expect(screen.queryByText('No meal planned')).not.toBeInTheDocument()
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

const createMockBirthday = (overrides: Partial<IBirthdayItem> = {}): IBirthdayItem => ({
  id: 'birthday-1',
  name: 'Alice',
  month: 6,
  day: 15,
  ...overrides
})

describe('UpcomingBirthdaysCard component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const renderBirthdays = (birthdays: IBirthdayItem[], isExpanded = false) =>
    render(
      <ThemeProvider theme={theme}>
        <UpcomingBirthdaysCard birthdays={birthdays} isExpanded={isExpanded} />
      </ThemeProvider>
    )

  it('should show the month and day number in the date badge', () => {
    // System time is 2024-01-15; birthday on Jan 16
    const birthday = createMockBirthday({ id: '1', name: 'Frank', month: 1, day: 16 })

    renderBirthdays([birthday])

    expect(screen.getByText('JAN')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
  })

  it('should show upcoming birthday names', () => {
    const birthday = createMockBirthday({ id: '1', name: 'Bob', month: 2, day: 1 })

    renderBirthdays([birthday])

    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('should show "Today!" for a birthday today', () => {
    const birthday = createMockBirthday({ id: '1', name: 'Charlie', month: 1, day: 15 })

    renderBirthdays([birthday])

    expect(screen.getByText('Today!')).toBeInTheDocument()
  })

  it('should show "Tomorrow" for a birthday tomorrow', () => {
    const birthday = createMockBirthday({ id: '1', name: 'Diana', month: 1, day: 16 })

    renderBirthdays([birthday])

    expect(screen.getByText('Tomorrow')).toBeInTheDocument()
  })

  it('should show days until for a birthday in the future', () => {
    const birthday = createMockBirthday({ id: '1', name: 'Eve', month: 1, day: 25 })

    renderBirthdays([birthday])

    expect(screen.getByText('10d')).toBeInTheDocument()
  })

  it('should show only the next 2 upcoming birthdays', () => {
    const birthdays = [
      createMockBirthday({ id: '1', name: 'Person 1', month: 1, day: 16 }),
      createMockBirthday({ id: '2', name: 'Person 2', month: 1, day: 17 }),
      createMockBirthday({ id: '3', name: 'Person 3', month: 1, day: 18 }),
      createMockBirthday({ id: '4', name: 'Person 4', month: 1, day: 19 }),
      createMockBirthday({ id: '5', name: 'Person 5', month: 1, day: 20 }),
    ]

    renderBirthdays(birthdays)

    expect(screen.getByText('Person 1')).toBeInTheDocument()
    expect(screen.getByText('Person 2')).toBeInTheDocument()
    expect(screen.queryByText('Person 3')).not.toBeInTheDocument()
    expect(screen.queryByText('Person 4')).not.toBeInTheDocument()
    expect(screen.queryByText('Person 5')).not.toBeInTheDocument()
  })

  it('should show empty state when no birthdays saved', () => {
    renderBirthdays([])

    expect(screen.getByText('No birthdays saved')).toBeInTheDocument()
  })
})
