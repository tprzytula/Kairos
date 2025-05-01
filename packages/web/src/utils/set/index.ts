export const addToSet = (set: Set<string>, item: string) => {
  const newSet = new Set(set)

  newSet.add(item)

  return newSet
}

export const removeFromSet = (set: Set<string>, item: string) => {
  const newSet = new Set(set)

  newSet.delete(item)

  return newSet
}
    