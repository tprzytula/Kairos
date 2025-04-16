import { render, screen, renderHook } from '@testing-library/react'
import { initialState, AppStateProvider, useAppState } from './index'

describe('Given the AppStateProvider component', () => {
  it('should render the component', () => {
    render(
      <AppStateProvider>
        <div>Test</div>
      </AppStateProvider>
    )
    expect(screen.getByText('Test')).toBeVisible()
  })
})

describe('Given the useAppState hook', () => {
  it('should return the state and dispatch', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    })

    expect(result.current.state).toBe(initialState)
    expect(result.current.dispatch).toBeDefined()
  })
})
