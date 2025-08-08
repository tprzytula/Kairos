import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@mui/material/styles'
import * as ReactRouter from 'react-router'
import EditToDoItemRoute from '.'
import { AppStateProvider } from '../../providers/AppStateProvider'
import AddItemForm from '../../components/AddItemForm'
import { FormFieldType } from '../../components/AddItemForm/enums'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import theme from '../../theme'

jest.mock('../../components/AddItemForm', () => {
  return jest.fn(() => <div>AddItemForm Mock</div>)
})

const mockNavigate = jest.fn()
const mockToDoListContext = {
  toDoList: [
    {
      id: '1',
      name: 'Test Todo',
      description: 'Test description',
      isDone: false,
      dueDate: 1234567890
    } as ITodoItem
  ],
  isLoading: false,
  refetchToDoList: jest.fn(),
  removeFromToDoList: jest.fn(),
  updateToDoItemFields: jest.fn()
}

jest.mock('../../providers/ToDoListProvider', () => ({
  ToDoListProvider: ({ children }: any) => children,
  useToDoListContext: () => mockToDoListContext,
}))

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}))

const renderComponent = async () => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppStateProvider>
          <EditToDoItemRoute />
        </AppStateProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

describe('Given the EditToDoItemRoute component', () => {
  beforeEach(() => {
    jest.mocked(ReactRouter.useNavigate).mockReturnValue(mockNavigate)
    jest.mocked(ReactRouter.useParams).mockReturnValue({ id: '1' })
    mockNavigate.mockClear()
    mockToDoListContext.updateToDoItemFields.mockClear()
  })

  it('should have the correct title', async () => {
    await renderComponent()
    expect(screen.getByText('Edit Todo Item')).toBeVisible()
  })

  it('should render the AddItemForm component with prefilled values', async () => {
    await renderComponent()
    
    const [firstCall] = jest.mocked(AddItemForm).mock.calls
    const props = firstCall[0]
    
    expect(props.fields).toHaveLength(3)
    
    const nameField = props.fields.find((field: any) => field.name === 'name')
    const descriptionField = props.fields.find((field: any) => field.name === 'description')
    const dueDateField = props.fields.find((field: any) => field.name === 'dueDate')
    
    expect(nameField).toBeDefined()
    expect(descriptionField).toBeDefined()
    expect(dueDateField).toBeDefined()
    
    expect(nameField!.value).toBe('Test Todo')
    expect(descriptionField!.value).toBe('Test description')
    expect(dueDateField!.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)  // ISO string format
  })

  it('should show loading when todo item is not found initially', async () => {
    jest.mocked(ReactRouter.useParams).mockReturnValue({ id: 'non-existent' })
    
    await renderComponent()
    
    expect(screen.getByText('Loading...')).toBeVisible()
  })

  describe('When the form is submitted', () => {
    it('should call updateToDoItemFields with correct data', async () => {
      await renderComponent()
      
      const [firstCall] = jest.mocked(AddItemForm).mock.calls
      const props = firstCall[0]
      
      const mockFields = [
        {
          name: 'name',
          value: 'Updated Todo',
          type: FormFieldType.TEXT,
          required: true,
          label: 'Name'
        },
        {
          name: 'description',
          value: 'Updated description',
          type: FormFieldType.TEXT,
          required: false,
          label: 'Description'
        },
        {
          name: 'dueDate',
          value: '2023-01-01T00:00:00.000Z',
          type: FormFieldType.DATE,
          required: true,
          label: 'Due Date'
        }
      ]
      
      await props.onSubmit(mockFields)
      
      expect(mockToDoListContext.updateToDoItemFields).toHaveBeenCalledWith('1', {
        name: 'Updated Todo',
        description: 'Updated description',
        dueDate: expect.any(Number)
      })
      
      expect(mockNavigate).toHaveBeenCalledWith('/todo')
    })

    it('should call updateToDoItemFields with only name when other fields are empty', async () => {
      await renderComponent()
      
      const [firstCall] = jest.mocked(AddItemForm).mock.calls
      const props = firstCall[0]
      
      const mockFields = [
        {
          name: 'name',
          value: 'Just Name',
          type: FormFieldType.TEXT,
          required: true,
          label: 'Name'
        },
        {
          name: 'description',
          value: '',
          type: FormFieldType.TEXTAREA,
          required: false,
          label: 'Description'
        },
        {
          name: 'dueDate',
          value: expect.any(String),
          type: FormFieldType.DATE,
          required: true,
          label: 'Due Date'
        }
      ]
      
      await props.onSubmit(mockFields)
      
      expect(mockToDoListContext.updateToDoItemFields).toHaveBeenCalledWith('1', {
        name: 'Just Name',
        description: '',
        dueDate: expect.any(Number)
      })
    })

    it('should handle errors gracefully', async () => {
      mockToDoListContext.updateToDoItemFields.mockRejectedValue(new Error('Update failed'))
      
      await renderComponent()
      
      const [firstCall] = jest.mocked(AddItemForm).mock.calls
      const props = firstCall[0]
      
      const mockFields = [
        {
          name: 'name',
          value: 'Updated Todo',
          type: FormFieldType.TEXT,
          required: true,
          label: 'Name'
        },
        {
          name: 'description',
          value: 'Updated description',
          type: FormFieldType.TEXT,
          required: false,
          label: 'Description'
        },
        {
          name: 'dueDate',
          value: expect.any(String),
          type: FormFieldType.DATE,
          required: true,
          label: 'Due Date'
        }
      ]
      
      await props.onSubmit(mockFields)
      
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })
})