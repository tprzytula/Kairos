import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../../../theme'
import { ToDoSection } from './index'
import { ITodoItem } from '../../../../api/toDoList/retrieve/types'
import { IToDoStats } from '../../../../hooks/useHomeData/types'

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

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('ToDoSection component', () => {
  const mockOnToggleExpansion = jest.fn()
  const mockOnItemToggle = jest.fn()

  beforeEach(() => {
    mockOnToggleExpansion.mockClear()
    mockOnItemToggle.mockClear()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('when loading', () => {
    it('should show loading placeholders', () => {
      const toDoStats = createMockToDoStats()
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={true}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      expect(screen.getByText('To-Do Items')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('when no todo items exist', () => {
    it('should show empty state message', () => {
      const toDoStats = createMockToDoStats()
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      expect(screen.getByText('No pending to-do items found')).toBeInTheDocument()
    })
  })

  describe('when todo items exist', () => {
    it('should display todo items', () => {
      const items = [
        createMockTodoItem({ id: '1', name: 'Task 1' }),
        createMockTodoItem({ id: '2', name: 'Task 2' }),
        createMockTodoItem({ id: '3', name: 'Task 3' })
      ]
      
      const toDoStats = createMockToDoStats({
        pendingItems: items,
        sortedItems: items,
        displayedItems: items,
        hasMoreItems: false
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      expect(screen.getByText('To-Do Items')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
      expect(screen.getByText('Task 3')).toBeInTheDocument()
    })

    it('should show due date information', () => {
      const tomorrowDate = new Date('2024-01-16T12:00:00Z').getTime()
      const item = createMockTodoItem({ 
        id: '1', 
        name: 'Task with due date',
        dueDate: tomorrowDate
      })
      
      const toDoStats = createMockToDoStats({
        pendingItems: [item],
        sortedItems: [item],
        displayedItems: [item],
        hasMoreItems: false
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      expect(screen.getByText('due tomorrow')).toBeInTheDocument()
    })

    it('should handle item clicks', () => {
      const item = createMockTodoItem({ id: '1', name: 'Clickable Task' })
      const toDoStats = createMockToDoStats({
        pendingItems: [item],
        sortedItems: [item],
        displayedItems: [item],
        hasMoreItems: false
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      fireEvent.click(screen.getByText('Clickable Task'))
      expect(mockOnItemToggle).toHaveBeenCalledWith('1')
    })

    it('should show truncated description when not expanded', () => {
      const longDescription = 'This is a very long description that should be truncated when the item is not expanded'
      const item = createMockTodoItem({ 
        id: '1', 
        name: 'Task with long description',
        description: longDescription
      })
      
      const toDoStats = createMockToDoStats({
        pendingItems: [item],
        sortedItems: [item],
        displayedItems: [item],
        hasMoreItems: false
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      expect(screen.getByText('This is a very long description that should be tru...')).toBeInTheDocument()
      expect(screen.queryByText(longDescription)).not.toBeInTheDocument()
    })

    it('should show full description when item is expanded', () => {
      const item = createMockTodoItem({ 
        id: '1', 
        name: 'Expanded Task',
        description: 'Full task description'
      })
      
      const toDoStats = createMockToDoStats({
        pendingItems: [item],
        sortedItems: [item],
        displayedItems: [item],
        hasMoreItems: false
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set(['1'])}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      expect(screen.getByText('Full task description')).toBeInTheDocument()
    })

    it('should show expanded due date details when item is expanded', () => {
      const tomorrowDate = new Date('2024-01-16T14:30:00Z').getTime()
      const item = createMockTodoItem({ 
        id: '1', 
        name: 'Task with expanded date',
        dueDate: tomorrowDate
      })
      
      const toDoStats = createMockToDoStats({
        pendingItems: [item],
        sortedItems: [item],
        displayedItems: [item],
        hasMoreItems: false
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set(['1'])}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      expect(screen.getByText('Due Date')).toBeInTheDocument()
      expect(screen.getByText(/Tue, Jan 16 at 02:30 PM/)).toBeInTheDocument()
    })
  })

  describe('expansion functionality', () => {
    it('should show "show more" indicator when there are more than 3 items', () => {
      const items = Array.from({ length: 5 }, (_, i) => 
        createMockTodoItem({ id: `${i + 1}`, name: `Task ${i + 1}` })
      )
      
      const toDoStats = createMockToDoStats({
        pendingItems: items,
        sortedItems: items,
        displayedItems: items.slice(0, 3),
        hasMoreItems: true
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      expect(screen.getByText('+2 more items')).toBeInTheDocument()
    })

    it('should show "show less" when expanded', () => {
      const items = Array.from({ length: 5 }, (_, i) => 
        createMockTodoItem({ id: `${i + 1}`, name: `Task ${i + 1}` })
      )
      
      const toDoStats = createMockToDoStats({
        pendingItems: items,
        sortedItems: items,
        displayedItems: items,
        hasMoreItems: true
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={true}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      expect(screen.getByText('Show less')).toBeInTheDocument()
    })

    it('should handle expansion toggle clicks', () => {
      const items = Array.from({ length: 5 }, (_, i) => 
        createMockTodoItem({ id: `${i + 1}`, name: `Task ${i + 1}` })
      )
      
      const toDoStats = createMockToDoStats({
        pendingItems: items,
        sortedItems: items,
        displayedItems: items.slice(0, 3),
        hasMoreItems: true
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      fireEvent.click(screen.getByText('+2 more items'))
      expect(mockOnToggleExpansion).toHaveBeenCalledTimes(1)
    })
  })

  describe('due date styling', () => {
    it('should apply correct styling for overdue tasks', () => {
      const yesterdayDate = new Date('2024-01-14T12:00:00Z').getTime()
      const item = createMockTodoItem({ 
        id: '1', 
        name: 'Overdue task',
        dueDate: yesterdayDate
      })
      
      const toDoStats = createMockToDoStats({
        pendingItems: [item],
        sortedItems: [item],
        displayedItems: [item],
        hasMoreItems: false
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      const dueDateElement = screen.getByText('overdue by 1 day')
      expect(dueDateElement).toHaveClass('overdue')
    })

    it('should apply correct styling for tasks due today', () => {
      const todayDate = new Date('2024-01-15T12:00:00Z').getTime()
      const item = createMockTodoItem({ 
        id: '1', 
        name: 'Today task',
        dueDate: todayDate
      })
      
      const toDoStats = createMockToDoStats({
        pendingItems: [item],
        sortedItems: [item],
        displayedItems: [item],
        hasMoreItems: false
      })
      
      renderWithTheme(
        <ToDoSection
          toDoStats={toDoStats}
          isLoading={false}
          isExpanded={false}
          expandedItems={new Set()}
          onToggleExpansion={mockOnToggleExpansion}
          onItemToggle={mockOnItemToggle}
        />
      )
      
      const dueDateElement = screen.getByText('due today')
      expect(dueDateElement).toHaveClass('today')
    })
  })
})
