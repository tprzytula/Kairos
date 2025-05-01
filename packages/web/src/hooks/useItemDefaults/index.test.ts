import { useItemDefaults } from "."
import { IItemDefault } from "./types"
import { GroceryItemUnit } from "../../enums/groceryItem"
import { renderHook, waitFor } from "@testing-library/react"

describe('Given the useItemDefaults hook', () => {
    it('should make request to fetch defaults', async () => {
        const fetchMethod = createFetchMethod(EXAMPLE_DEFAULTS);

        renderHook(() => 
            useItemDefaults({ 
                fetchMethod 
            })
        )

        expect(fetchMethod).toHaveBeenCalled()
    })

    it('should return the defaults', async () => {
        const { result } = renderHook(() => 
            useItemDefaults({ 
                fetchMethod: createFetchMethod(EXAMPLE_DEFAULTS) 
            })
        )

        await waitFor(() => {
            expect(result.current.defaults).toEqual(EXAMPLE_DEFAULTS)
        })
    })
})

const createFetchMethod = (defaults: Array<IItemDefault>) => {
    return jest.fn().mockResolvedValue(defaults)
}

const EXAMPLE_DEFAULTS: Array<IItemDefault> = [
    {
        name: 'apple',
        unit: GroceryItemUnit.KILOGRAM,
        icon: '/assets/icons/apple.png'
    }
]