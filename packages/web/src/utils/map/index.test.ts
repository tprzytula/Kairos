import { addToMap, removeFromMap } from "."

describe('Given the addToMap function', () => {
    it('should add a key-value pair to the map', () => {
        const map = new Map()
        const key = 'key'
        const value = 'value'

        const newMap = addToMap(map, key, value)

        expect(newMap.get(key)).toBe(value)
    })
})

describe('Given the removeFromMap function', () => {
    it('should remove a key-value pair from the map', () => {
        const map = new Map()
        const key = 'key'
        const value = 'value'

        addToMap(map, key, value)

        const newMap = removeFromMap(map, key)

        expect(newMap.get(key)).toBeUndefined()
    })
})
