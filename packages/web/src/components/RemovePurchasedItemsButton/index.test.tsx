import { render, screen, act } from "@testing-library/react"
import RemovePurchasedItemsButton from "."
import * as AppState from '../../providers/AppStateProvider'
import * as GroceryListProvider from '../../providers/GroceryListProvider'
import * as GroceryListAPI from '../../api/groceryList'
import { showAlert } from "../../utils/alert"

jest.mock('../../providers/AppStateProvider')
jest.mock('../../providers/GroceryListProvider')
jest.mock('../../api/groceryList')
jest.mock('../../utils/alert')

describe('Given the RemovePurchasedItemsButton component', () => {
    describe('When the grocery list is empty', () => {
        it('should show empty list status', () => {
            mockUseAppState({ purchasedItems: new Set() })
            mockUseGroceryListContext({ groceryList: [] })

            render(<RemovePurchasedItemsButton />)

            expect(screen.getByText('Your grocery list is empty')).toBeVisible()
            expect(screen.queryByText('Remove Purchased Items')).not.toBeInTheDocument()
        })
    })

    describe('When there are items but none purchased', () => {
        it('should show item count status', () => {
            mockUseAppState({ purchasedItems: new Set() })
            mockUseGroceryListContext({ groceryList: [{ id: '1' }, { id: '2' }, { id: '3' }] })

            render(<RemovePurchasedItemsButton />)

            expect(screen.getByText('3 items in your list')).toBeVisible()
            expect(screen.queryByText('Remove Purchased Items')).not.toBeInTheDocument()
        })
    })

    describe('When there is one item and none purchased', () => {
        it('should show singular item count', () => {
            mockUseAppState({ purchasedItems: new Set() })
            mockUseGroceryListContext({ groceryList: [{ id: '1' }] })

            render(<RemovePurchasedItemsButton />)

            expect(screen.getByText('1 item in your list')).toBeVisible()
        })
    })

    describe('When there are multiple items but none purchased', () => {
        it('should show item count status', () => {
            mockUseAppState({ purchasedItems: new Set() })
            mockUseGroceryListContext({ groceryList: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }] })

            render(<RemovePurchasedItemsButton />)

            expect(screen.getByText('4 items in your list')).toBeVisible()
            expect(screen.queryByText('Remove Purchased Items')).not.toBeInTheDocument()
        })
    })

    describe('When items are selected for removal', () => {
        it('should render the action button', () => {
            mockUseAppState({ purchasedItems: new Set(['1']) })
            mockUseGroceryListContext({ groceryList: [{ id: '1' }, { id: '2' }] })

            render(<RemovePurchasedItemsButton />)

            expect(screen.getByText('Remove Purchased Items')).toBeVisible()
            expect(screen.queryByText(/items? in your list/)).not.toBeInTheDocument()
        })

        describe('And the button is clicked', () => {
            it('should remove the purchased items', async () => {
                const ids = ['1', '2']

                jest.spyOn(GroceryListAPI, 'removeGroceryItems').mockResolvedValue()
                mockUseAppState({ purchasedItems: new Set(ids) })
                mockUseGroceryListContext({ groceryList: [{ id: '1' }, { id: '2' }, { id: '3' }] })

                render(<RemovePurchasedItemsButton />)

                await act(async () => {
                    screen.getByText('Remove Purchased Items').click()
                })

                expect(GroceryListAPI.removeGroceryItems).toHaveBeenCalledWith(ids)
            })

            describe('And the API call fails', () => {
                it('should show an error alert', async () => {
                    jest.spyOn(GroceryListAPI, 'removeGroceryItems').mockRejectedValue(new Error('Failed to remove items'))
                    const dispatch = mockUseAppState({ purchasedItems: new Set(['1']) })
                    mockUseGroceryListContext({ groceryList: [{ id: '1' }] })

                    render(<RemovePurchasedItemsButton />)

                    await act(async () => {
                        screen.getByText('Remove Purchased Items').click()
                    })

                    expect(showAlert).toHaveBeenCalledWith({
                        description: 'Failed to remove purchased items',
                        severity: 'error',
                    }, dispatch)
                })
            })
        })
    })
})

const mockUseAppState = ({ purchasedItems }: { purchasedItems: Set<string> }) => {
    const dispatch = jest.fn()

    jest.spyOn(AppState, 'useAppState').mockReturnValue({
        state: {
            purchasedItems,
            selectedTodoItems: new Set(),
            alerts: new Map(),
        },
        dispatch,
    })

    return dispatch
}

const mockUseGroceryListContext = ({ groceryList }: { groceryList: Array<any> }) => {
    const refetchGroceryList = jest.fn()

    jest.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue({
        groceryList,
        isLoading: false,
        refetchGroceryList,
        removeGroceryItem: jest.fn(),
        updateGroceryItem: jest.fn(),
    })

    return { refetchGroceryList }
}
