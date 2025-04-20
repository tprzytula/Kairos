export const addToSet = (set: Set<string>, item: string) => {
  const newSet = new Set(set)

  newSet.add(item)

  return newSet
}

export const removeFromSet = (set: Set<string>, ...items: Array<string>) => {
  const newSet = new Set(set)

  items.forEach(item => newSet.delete(item))

  return newSet
}
    