declare module 'jest-fetch-mock' {
  export type FetchMock = typeof fetch & {
    mockResponseOnce(body: string, init?: ResponseInit): FetchMock
    mockResponse(body: string, init?: ResponseInit): FetchMock
    mockReject(error?: Error): FetchMock
    resetMocks(): void
    enableMocks(): void
    disableMocks(): void
    mockResolvedValue(data: unknown): FetchMock
    mockResolvedValueOnce(data: unknown): FetchMock
  }
}
