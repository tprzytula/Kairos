import { render, screen, fireEvent } from '@testing-library/react'
import dayjs from 'dayjs'
import WeeklyView from './index'

// JSDOM does not implement scrollTo
window.HTMLElement.prototype.scrollTo = jest.fn()
import { ITodoItem } from '../../../api/toDoList/retrieve/types'
import { IBirthdayItem } from '../../../api/birthdays/retrieve/types'
import { IMealPlan } from '../../../types/mealPlan'
import { MealType } from '../../../enums/mealType'

const today = dayjs()
const todayTimestamp = today.valueOf()
const todayStr = today.format('YYYY-MM-DD')

const makeTodo = (overrides: Partial<ITodoItem> = {}): ITodoItem => ({
  id: 'todo-1',
  name: 'Test task',
  isDone: false,
  dueDate: todayTimestamp,
  steps: [],
  ...overrides,
})

const makeBirthday = (overrides: Partial<IBirthdayItem> = {}): IBirthdayItem => ({
  id: 'bday-1',
  name: 'Alice',
  month: today.month() + 1,
  day: today.date(),
  ...overrides,
})

const makeMeal = (overrides: Partial<IMealPlan> = {}): IMealPlan => ({
  id: 'meal-1',
  projectId: 'proj-1',
  date: todayStr,
  recipeName: 'Pasta',
  recipeId: 'recipe-1',
  mealType: MealType.Dinner,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
  ...overrides,
})

describe('Given the WeeklyView component', () => {
  it('should render the week range label', () => {
    render(<WeeklyView visibleToDoItems={[]} onItemClick={jest.fn()} />)
    const start = dayjs().startOf('week').format('MMM D')
    expect(screen.getByText(new RegExp(start))).toBeVisible()
  })

  it('should render navigation buttons', () => {
    render(<WeeklyView visibleToDoItems={[]} onItemClick={jest.fn()} />)
    expect(screen.getByLabelText('Previous week')).toBeVisible()
    expect(screen.getByLabelText('Next week')).toBeVisible()
  })

  it('should not show Today button when already on current week', () => {
    render(<WeeklyView visibleToDoItems={[]} onItemClick={jest.fn()} />)
    expect(screen.queryByRole('button', { name: /today/i })).not.toBeInTheDocument()
  })

  it('should show Today button after navigating away', () => {
    render(<WeeklyView visibleToDoItems={[]} onItemClick={jest.fn()} />)
    fireEvent.click(screen.getByLabelText('Next week'))
    expect(screen.getByRole('button', { name: /today/i })).toBeVisible()
  })

  it('should navigate back to current week when Today is clicked', () => {
    render(<WeeklyView visibleToDoItems={[]} onItemClick={jest.fn()} />)
    fireEvent.click(screen.getByLabelText('Next week'))
    const todayBtn = screen.getByRole('button', { name: /today/i })
    fireEvent.click(todayBtn)
    expect(screen.queryByRole('button', { name: /today/i })).not.toBeInTheDocument()
  })

  it('should render 7 add meal buttons', () => {
    render(<WeeklyView visibleToDoItems={[]} onItemClick={jest.fn()} />)
    const addMealTexts = screen.getAllByText('Meal')
    expect(addMealTexts).toHaveLength(7)
  })

  it('should render a pending todo on the correct day', () => {
    const todo = makeTodo({ name: 'Buy groceries' })
    render(<WeeklyView visibleToDoItems={[todo]} onItemClick={jest.fn()} />)
    expect(screen.getByText('Buy groceries')).toBeVisible()
  })

  it('should call onItemClick when a todo item is clicked', () => {
    const onItemClick = jest.fn()
    const todo = makeTodo({ id: 'todo-abc', name: 'Test task' })
    render(<WeeklyView visibleToDoItems={[todo]} onItemClick={onItemClick} />)
    fireEvent.click(screen.getByText('Test task'))
    expect(onItemClick).toHaveBeenCalledWith('todo-abc')
  })

  it('should render a birthday item', () => {
    const birthday = makeBirthday({ name: 'Alice' })
    render(<WeeklyView visibleToDoItems={[]} onItemClick={jest.fn()} birthdayItems={[birthday]} />)
    expect(screen.getByText('Alice')).toBeVisible()
  })

  it('should call onBirthdayClick when a birthday item is clicked', () => {
    const onBirthdayClick = jest.fn()
    const birthday = makeBirthday({ id: 'bday-xyz', name: 'Alice' })
    render(
      <WeeklyView
        visibleToDoItems={[]}
        onItemClick={jest.fn()}
        birthdayItems={[birthday]}
        onBirthdayClick={onBirthdayClick}
      />
    )
    fireEvent.click(screen.getByText('Alice'))
    expect(onBirthdayClick).toHaveBeenCalledWith('bday-xyz')
  })

  it('should render a meal plan item', () => {
    const meal = makeMeal({ recipeName: 'Pasta' })
    render(<WeeklyView visibleToDoItems={[]} onItemClick={jest.fn()} mealPlans={[meal]} />)
    expect(screen.getByText('Pasta')).toBeVisible()
  })

  it('should call onMealPlanClick when a meal is clicked', () => {
    const onMealPlanClick = jest.fn()
    const meal = makeMeal()
    render(
      <WeeklyView
        visibleToDoItems={[]}
        onItemClick={jest.fn()}
        mealPlans={[meal]}
        onMealPlanClick={onMealPlanClick}
      />
    )
    fireEvent.click(screen.getByText('Pasta'))
    expect(onMealPlanClick).toHaveBeenCalledWith(meal)
  })

  it('should call onAddMealPlan with correct date when add meal button is clicked', () => {
    const onAddMealPlan = jest.fn()
    render(<WeeklyView visibleToDoItems={[]} onItemClick={jest.fn()} onAddMealPlan={onAddMealPlan} />)
    const mealButtons = screen.getAllByText('Meal')
    fireEvent.click(mealButtons[0])
    expect(onAddMealPlan).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/))
  })

  it('should not render a todo with no dueDate in the weekly grid', () => {
    const todo = makeTodo({ id: 'no-date', name: 'No due date task' })
    todo.dueDate = undefined
    render(<WeeklyView visibleToDoItems={[todo]} onItemClick={jest.fn()} />)
    expect(screen.queryByText('No due date task')).not.toBeInTheDocument()
  })
})
