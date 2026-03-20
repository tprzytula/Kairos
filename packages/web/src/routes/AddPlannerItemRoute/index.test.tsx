import { Mock } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import { AddPlannerItemContent } from '.'
import ItemForm from '../../components/ItemForm'
import { addTodoItem } from '../../api/toDoList'
import { FormFieldType } from '../../components/ItemForm/enums'
import * as ReactRouter from 'react-router'
import { usePlannerContext } from '../../providers/PlannerProvider'
import { useProjectContext } from '../../providers/ProjectProvider'

vi.mock('react-router', async () => ({  
  ...(await vi.importActual('react-router')),
  useNavigate: vi.fn(() => vi.fn()),
}))

vi.mock('../../api/toDoList');
vi.mock('../../components/ItemForm');
vi.mock('../../providers/PlannerProvider');
vi.mock('../../providers/ProjectProvider');
vi.mock('../../components/ModernPageHeader', () => ({
  default: ({ title }: any) => <div>{title}</div>
}));
vi.mock('@mui/icons-material/Checklist', () => ({
  default: () => <div>ChecklistIcon</div>
}))
vi.mock('react-oidc-context', async () => ({
  useAuth: vi.fn(() => ({
    user: { access_token: 'test-access-token' }
  }))
}))

describe('Given the AddPlannerItemContent component', () => {
  const mockProject = {
    id: 'test-project-id',
    name: 'Test Project',
    isPersonal: false
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (usePlannerContext as Mock).mockReturnValue({
      toDoList: [],
      isLoading: false,
      refetchToDoList: vi.fn(),
      removeFromToDoList: vi.fn(),
      updateToDoItemFields: vi.fn(),
    });

    (useProjectContext as Mock).mockReturnValue({
      projects: [mockProject],
      currentProject: mockProject,
      isLoading: false,
      createProject: vi.fn(),
      joinProject: vi.fn(),
      switchProject: vi.fn(),
      fetchProjects: vi.fn(),
      getProjectInviteInfo: vi.fn(),
    });
  })

  it('should have the correct title', async () => {
    await renderComponent()
    expect(screen.getByText('Add Task')).toBeVisible()
  })

  it('should render the ItemForm component', async () => {
    await renderComponent()
    expect(ItemForm).toHaveBeenCalled()
  })

  describe('When the form is submitted', () => {
    it('should create a new to do item', async () => {
      let onSubmitCallback: any;

      vi.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
        onSubmitCallback = onSubmit;
        return <div>ItemForm</div>
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
      it('should navigate to the planner page', async () => {
        const navigateSpy = vi.fn()

        vi.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

        let onSubmitCallback: any;

        vi.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>ItemForm</div>
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

        expect(navigateSpy).toHaveBeenCalledWith('/planner')
      })
    })

    describe('And the createToDoItem call fails', () => {
      it('should log the error', async () => {
        const consoleSpy = vi.spyOn(console, 'error')
        let onSubmitCallback: any;

        vi.mocked(ItemForm).mockImplementation(({ onSubmit }) => {
          onSubmitCallback = onSubmit;
          return <div>ItemForm</div>
        })

        vi.mocked(addTodoItem).mockRejectedValue(new Error('Error creating to do item'))
        
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
          <AddPlannerItemContent />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}
