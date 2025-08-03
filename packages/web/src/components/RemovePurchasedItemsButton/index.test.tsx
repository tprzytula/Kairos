import { render, screen, act } from "@testing-library/react"
import RemovePurchasedItemsButton from "."
import * as AppState from '../../providers/AppStateProvider'
import * as GroceryListAPI from '../../api/groceryList'
import { showAlert } from "../../utils/alert"

jest.mock('../../providers/AppStateProvider')
jest.mock('../../api/groceryList')
jest.mock('../../utils/alert')

describe('Given the RemovePurchasedItemsButton component', () => {
    describe('When there is no purchased item', () => {
        it('should not show the action button', () => {
            mockUseAppState({ purchasedItems: new Set() })

            render(<RemovePurchasedItemsButton />)

            expect(screen.getByText('Remove Purchased Items')).not.toBeVisible()
        })
    })

    describe('When there is at least one purchased item', () => {
        it('should render the action button', () => {
            mockUseAppState({ purchasedItems: new Set(['1']) })

            render(<RemovePurchasedItemsButton />)

            expect(screen.getByText('Remove Purchased Items')).toBeVisible()
        })

        describe('And the button is clicked', () => {
            it('should remove the purchased items', async () => {
                const ids = ['1', '2']

                jest.spyOn(GroceryListAPI, 'removeGroceryItems').mockResolvedValue()
                mockUseAppState({ purchasedItems: new Set(ids) })

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
