export const createBodyParser = <T>(
  validate: (body: unknown) => body is T,
) => {
  return (body: string | null): T | null => {
    if (!body) {
      return null
    }

    try {
      const parsedBody = JSON.parse(body)

      if (validate(parsedBody)) {
        return parsedBody
      }
    } catch (error) {
      console.error("Failed to parse body:", error)
    }

    return null
  }
}
