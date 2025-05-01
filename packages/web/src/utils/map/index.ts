export const addToMap = <K, V>(map: Map<K, V>, key: K, value: V) => {
    const newMap = createMap(map)

    newMap.set(key, value)
    
    return newMap
}

export const removeFromMap = <K, V>(map: Map<K, V>, key: K) => {
    const newMap = createMap(map)

    newMap.delete(key)

    return newMap
}

const createMap = <K, V>(map: Map<K, V>) => {
    return new Map<K, V>(map)
}
