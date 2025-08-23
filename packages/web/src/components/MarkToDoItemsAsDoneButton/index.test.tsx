import { render, screen, act } from "@testing-library/react"
import MarkToDoItemsAsDoneButton from "."
import * as AppState from '../../providers/AppStateProvider'
import * as ToDoListProvider from '../../providers/ToDoListProvider'
import * as ProjectProvider from '../../providers/ProjectProvider'
import * as ToDoListAPI from '../../api/toDoList'
import { showAlert } from "../../utils/alert"

jest.mock('../../providers/AppStateProvider')
jest.mock('../../providers/ToDoListProvider')
jest.mock('../../providers/ProjectProvider')
jest.mock('../../api/toDoList')
jest.mock('../../utils/alert')

describe('Given the MarkToDoItemsAsDoneButton component', () => {
    beforeEach(() => {
        jest.spyOn(ProjectProvider, 'useProjectContext').mockReturnValue({
            currentProject: { 
                id: 'test-project-id', 
                name: 'Test Project',
                ownerId: 'test-owner-id',
                isPersonal: false,
                maxMembers: 10,
                inviteCode: 'test-invite-code',
                createdAt: '2023-01-01T00:00:00Z'
            },
            projects: [],
            createProject: jest.fn(),
            joinProject: jest.fn(),
            switchProject: jest.fn(),
            fetchProjects: jest.fn(),
            getProjectInviteInfo: jest.fn(),
            isLoading: false,
        })
    })

    describe('When the to-do list is empty', () => {
        it('should show empty list status', () => {
            mockUseAppState({ selectedTodoItems: new Set() })
            mockUseToDoListContext({ toDoList: [] })

            render(<MarkToDoItemsAsDoneButton />)

            expect(screen.getByText('Your to-do list is empty')).toBeVisible()
            expect(screen.queryByText('Mark To Do Items As Done')).not.toBeInTheDocument()
        })
    })

    describe('When there are items but none selected', () => {
        it('should show action guidance', () => {
            mockUseAppState({ selectedTodoItems: new Set() })
            mockUseToDoListContext({ toDoList: [{ id: '1' }, { id: '2' }, { id: '3' }] })

            render(<MarkToDoItemsAsDoneButton />)

            expect(screen.getByText('Tap items to mark as done')).toBeVisible()
            expect(screen.queryByText('Mark To Do Items As Done')).not.toBeInTheDocument()
        })
    })

    describe('When there is one item and none selected', () => {
        it('should show action guidance', () => {
            mockUseAppState({ selectedTodoItems: new Set() })
            mockUseToDoListContext({ toDoList: [{ id: '1' }] })

            render(<MarkToDoItemsAsDoneButton />)

            expect(screen.getByText('Tap items to mark as done')).toBeVisible()
        })
    })

    describe('When there are multiple items but none selected', () => {
        it('should show action guidance', () => {
            mockUseAppState({ selectedTodoItems: new Set() })
            mockUseToDoListContext({ toDoList: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }] })

            render(<MarkToDoItemsAsDoneButton />)

            expect(screen.getByText('Tap items to mark as done')).toBeVisible()
            expect(screen.queryByText('Mark To Do Items As Done')).not.toBeInTheDocument()
        })
    })

    describe('When items are selected for completion', () => {
        it('should render the action button', () => {
            mockUseAppState({ selectedTodoItems: new Set(['1']) })
            mockUseToDoListContext({ toDoList: [{ id: '1' }, { id: '2' }] })

            render(<MarkToDoItemsAsDoneButton />)

            expect(screen.getByText('Mark To Do Items As Done')).toBeVisible()
            expect(screen.queryByText(/Tap items to mark as done/)).not.toBeInTheDocument()
        })

        describe('And the button is clicked', () => {
            it('should mark the selected items as done', async () => {
                const ids = ['1', '2']

                jest.spyOn(ToDoListAPI, 'updateToDoItems').mockResolvedValue(ids.map(id => ({ id, isDone: true })))
                mockUseAppState({ selectedTodoItems: new Set(ids) })
                mockUseToDoListContext({ toDoList: [{ id: '1' }, { id: '2' }, { id: '3' }] })

                render(<MarkToDoItemsAsDoneButton />)

                await act(async () => {
                    screen.getByText('Mark To Do Items As Done').click()
                })

                expect(ToDoListAPI.updateToDoItems).toHaveBeenCalledWith(ids.map(id => ({ id, isDone: true })), 'test-project-id')
            })

            describe('And the API call fails', () => {
                it('should show an error alert', async () => {
                    jest.spyOn(ToDoListAPI, 'updateToDoItems').mockRejectedValue(new Error('Failed to mark to do items as done'))
                    const dispatch = mockUseAppState({ selectedTodoItems: new Set(['1']) })
                    mockUseToDoListContext({ toDoList: [{ id: '1' }] })

                    render(<MarkToDoItemsAsDoneButton />)

                    await act(async () => {
                        screen.getByText('Mark To Do Items As Done').click()
                    })

                    expect(showAlert).toHaveBeenCalledWith({
                        description: 'Failed to mark to do items as done',
                        severity: 'error',
                    }, dispatch)
                })
            })
        })
    })
})

const mockUseAppState = ({ selectedTodoItems }: { selectedTodoItems: Set<string> }) => {
    const dispatch = jest.fn()

    jest.spyOn(AppState, 'useAppState').mockReturnValue({
        state: {
            purchasedItems: new Set(),
            selectedTodoItems,
            alerts: new Map(),
        },
        dispatch,
    })

    return dispatch
}

const mockUseToDoListContext = ({ toDoList }: { toDoList: Array<{ id: string; name?: string; isDone?: boolean }> }) => {
    const fullToDoList = toDoList.map(item => ({
        id: item.id,
        name: item.name || `Item ${item.id}`,
        isDone: item.isDone || false,
    }))

    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue({
        toDoList: fullToDoList,
        isLoading: false,
        refetchToDoList: jest.fn(),
        removeFromToDoList: jest.fn(),
        updateToDoItemFields: jest.fn(),
    })
}
