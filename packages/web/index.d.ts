declare module '*.png' {
  const value: string
  export = value
}

declare module '*.json' {
  const value: Record<string, any>
  export default value
}

declare module '**/package.json' {
  interface PackageJson {
    name: string
    version: string
    description?: string
    author?: string
    license?: string
    [key: string]: any
  }
  const value: PackageJson
  export default value
}
