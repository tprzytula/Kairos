import { render, screen, act } from "@testing-library/react"
import MarkToDoItemsAsDoneButton from "."
import * as AppState from '../../providers/AppStateProvider'
import * as ToDoListAPI from '../../api/toDoList'
import { showAlert } from "../../utils/alert"

jest.mock('../../providers/AppStateProvider')
jest.mock('../../api/toDoList')
jest.mock('../../utils/alert')

describe('Given the MarkToDoItemsAsDoneButton component', () => {
    describe('When there is no purchased item', () => {
        it('should not show the action button', () => {
            mockUseAppState({ selectedTodoItems: new Set() })

            render(<MarkToDoItemsAsDoneButton />)

            expect(screen.getByText('Mark To Do Items As Done')).not.toBeVisible()
        })
    })

    describe('When there is at least one purchased item', () => {
        it('should render the action button', () => {
            mockUseAppState({ selectedTodoItems: new Set(['1']) })

            render(<MarkToDoItemsAsDoneButton />)

            expect(screen.getByText('Mark To Do Items As Done')).toBeVisible()
        })

        describe('And the button is clicked', () => {
            it('should remove the purchased items', async () => {
                const ids = ['1', '2']

                jest.spyOn(ToDoListAPI, 'updateToDoItems').mockResolvedValue(ids.map(id => ({ id, isDone: true })))
                mockUseAppState({ selectedTodoItems: new Set(ids) })

                render(<MarkToDoItemsAsDoneButton />)

                await act(async () => {
                    screen.getByText('Mark To Do Items As Done').click()
                })

                expect(ToDoListAPI.updateToDoItems).toHaveBeenCalledWith(ids.map(id => ({ id, isDone: true })))
            })

            describe('And the API call fails', () => {
                it('should show an error alert', async () => {
                    jest.spyOn(ToDoListAPI, 'updateToDoItems').mockRejectedValue(new Error('Failed to mark to do items as done'))
                    const dispatch = mockUseAppState({ selectedTodoItems: new Set(['1']) })

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
            skipStartingScreen: true,
        },
        dispatch,
    })

    return dispatch
}
