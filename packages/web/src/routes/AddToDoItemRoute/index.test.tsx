import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import { AddToDoItemContent } from '.'
import AddItemForm from '../../components/AddItemForm'
import { addTodoItem } from '../../api/toDoList'
import { FormFieldType } from '../../components/AddItemForm/enums'
import * as ReactRouter from 'react-router'
import { useToDoListContext } from '../../providers/ToDoListProvider'
import { useProjectContext } from '../../providers/ProjectProvider'

jest.mock('react-router', () => ({  
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('../../api/toDoList');
jest.mock('../../components/AddItemForm');
jest.mock('../../providers/ToDoListProvider');
jest.mock('../../providers/ProjectProvider');
jest.mock('../../components/ModernPageHeader', () => ({ title }: any) => <div>{title}</div>);
jest.mock('@mui/icons-material/Checklist', () => () => <div>ChecklistIcon</div>)
jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(() => ({
    user: { access_token: 'test-access-token' }
  }))
}))

describe('Given the AddToDoItemContent component', () => {
  const mockProject = {
    id: 'test-project-id',
    name: 'Test Project',
    isPersonal: false
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useToDoListContext as jest.Mock).mockReturnValue({
      toDoList: [],
      isLoading: false,
      refetchToDoList: jest.fn(),
      removeFromToDoList: jest.fn(),
      updateToDoItemFields: jest.fn(),
    });

    (useProjectContext as jest.Mock).mockReturnValue({
      projects: [mockProject],
      currentProject: mockProject,
      isLoading: false,
      createProject: jest.fn(),
      joinProject: jest.fn(),
      switchProject: jest.fn(),
      fetchProjects: jest.fn(),
      getProjectInviteInfo: jest.fn(),
    });
  })

  it('should have the correct title', async () => {
    await renderComponent()
    expect(screen.getByText('Add To-Do Item')).toBeVisible()
  })

  it('should render the AddItemForm component', async () => {
    await renderComponent()
    expect(AddItemForm).toHaveBeenCalled()
  })

  describe('When the form is submitted', () => {
    it('should create a new to do item', async () => {
      let onSubmitCallback: any;

      jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
        onSubmitCallback = onSubmit;
        return <div>AddItemForm</div>
      })

      renderComponent()

      await act(async () => {
        onSubmitCallback([
          {
            name: 'Name',
            type: FormFieldType.TEXT,
            required: true,
            value: 'Test',
          },
          {
            name: 'Description',
            type: FormFieldType.TEXT,
            required: false,
            value: 'Test',
          },
          {
            name: 'Due Date',
            type: FormFieldType.DATE,
            required: false,
            value: '2021-01-01',
          },
        ])
      })

      expect(addTodoItem).toHaveBeenCalledWith({
        name: 'Test',
        description: 'Test',
        dueDate: 1609459200000
      }, 'test-project-id', 'test-access-token')  
    })

    describe('And the createToDoItem call succeeds', () => {
      it('should navigate to the to do list page', async () => {
        const navigateSpy = jest.fn()

        jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

        let onSubmitCallback: any;

        jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>AddItemForm</div>
        })

        renderComponent()
        await act(async () => {
          onSubmitCallback([
            {
              name: 'Name',
              type: FormFieldType.TEXT,
              required: true,
              value: 'Test',
            },
            {
              name: 'Description',
              type: FormFieldType.TEXT,
              required: false,
              value: 'Test',
            },
            {
              name: 'Due Date',
              type: FormFieldType.DATE,
              required: false,
              value: '2021-01-01',
            },
          ])
        })

        expect(navigateSpy).toHaveBeenCalledWith('/todo')
      })
    })

    describe('And the createToDoItem call fails', () => {
      it('should log the error', async () => {
        const consoleSpy = jest.spyOn(console, 'error')
        let onSubmitCallback: any;

        jest.mocked(AddItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>AddItemForm</div>
        })

        jest.mocked(addTodoItem).mockRejectedValue(new Error('Error creating to do item'))
        
        renderComponent()
        await act(async () => {
          onSubmitCallback([
            {
              name: 'Name',
              type: FormFieldType.TEXT,
              required: true,
              value: 'Test',
            },
            {
              name: 'Description',
              type: FormFieldType.TEXT,
              required: false,
              value: 'Test',
            },
            {
              name: 'Due Date',
              type: FormFieldType.DATE,
              required: false,
              value: '2021-01-01',
            },
          ])
        })

        expect(consoleSpy).toHaveBeenCalledWith(new Error('Error creating to do item'))
      })
    })
  })
})

const renderComponent = () => {
  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <AddToDoItemContent />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}
