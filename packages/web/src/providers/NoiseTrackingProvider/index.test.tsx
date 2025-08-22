import React from 'react'
import { render, screen, renderHook, waitFor, act } from '@testing-library/react'
import * as API from '../../api/noiseTracking'
import { INoiseTrackingItem } from '../../api/noiseTracking'
import { NoiseTrackingProvider, useNoiseTrackingContext } from './index'
import { ProjectContext } from '../ProjectProvider'
import { IProject } from '../../types/project'

jest.mock('../../api/noiseTracking')
jest.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { access_token: 'mock-token' }
  })
}))
jest.mock('../../api/projects', () => ({
  retrieveUserProjects: jest.fn().mockResolvedValue([])
}))

describe('Given the NoiseTrackingProvider component', () => {
  it('should render the component', async () => {
    await act(async () => {
      renderNoiseTrackingProvider()
    })

    expect(screen.getByText('Test')).toBeVisible()
  })

  it('should make a request to the API', async () => {
    jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue(EXAMPLE_NOISE_TRACKING_ITEMS)

    await act(async () => {
      renderNoiseTrackingProvider()
    })

    await waitFor(() => expect(API.retrieveNoiseTrackingItems).toHaveBeenCalled())
  })

  describe('When the API request fails', () => {
    it('should log an error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      jest.spyOn(API, 'retrieveNoiseTrackingItems').mockRejectedValue(new Error('It is what it is'))

      await act(async () => {
        renderNoiseTrackingProvider()
      })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch noise tracking items:', new Error('It is what it is'))
      })
    })
  })
})

describe('Given the useNoiseTrackingContext hook', () => {
  it('should return the noise tracking items', async () => {
      jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue(EXAMPLE_NOISE_TRACKING_ITEMS)

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockProjectProvider>
        <NoiseTrackingProvider>{children}</NoiseTrackingProvider>
      </MockProjectProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useNoiseTrackingContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.noiseTrackingItems).toStrictEqual(EXAMPLE_NOISE_TRACKING_ITEMS)
    })
  })

  it('should allow you to refetch the noise tracking items', async () => {
    jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue(EXAMPLE_NOISE_TRACKING_ITEMS)

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockProjectProvider>
        <NoiseTrackingProvider>{children}</NoiseTrackingProvider>
      </MockProjectProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useNoiseTrackingContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.noiseTrackingItems).toStrictEqual(EXAMPLE_NOISE_TRACKING_ITEMS)
    })

    jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue([
      {
        timestamp: 1714003200000,
      },
    ])

    await act(async () => {
      await result.current.refetchNoiseTrackingItems()
    })

    await waitFor(() => {
      expect(result.current.noiseTrackingItems).toStrictEqual([
        {
          timestamp: 1714003200000,
        },
      ])
    })
  })

  describe('When the API request fails', () => {
    it('should return an empty array', async () => {
      jest.spyOn(API, 'retrieveNoiseTrackingItems').mockRejectedValue(new Error('It is what it is'))

      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockProjectProvider>
          <NoiseTrackingProvider>{children}</NoiseTrackingProvider>
        </MockProjectProvider>
      )

      const { result } = await waitFor(() => renderHook(() => useNoiseTrackingContext(), {
        wrapper: Wrapper,
      }))

      await waitFor(() => {
        expect(result.current.noiseTrackingItems).toStrictEqual([])
      })
    })
  })

  describe('Context initialization', () => {
    it('should provide initial state values', async () => {
      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <MockProjectProvider>
          <NoiseTrackingProvider>{children}</NoiseTrackingProvider>
        </MockProjectProvider>
      )

      const { result } = renderHook(() => useNoiseTrackingContext(), {
        wrapper: Wrapper,
      })

      await waitFor(() => {
        expect(result.current.noiseTrackingItems).toEqual([])
        expect(result.current.isLoading).toBe(false)
        expect(typeof result.current.refetchNoiseTrackingItems).toBe('function')
      })
    })

    it('should handle context usage outside provider', () => {
      // Test the useContext behavior when used outside provider
      const { result } = renderHook(() => useNoiseTrackingContext())
      
      // Should return initial state values
      expect(result.current.noiseTrackingItems).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(typeof result.current.refetchNoiseTrackingItems).toBe('function')
    })
  })
})

const EXAMPLE_NOISE_TRACKING_ITEMS: Array<INoiseTrackingItem> = [
  {
    timestamp: 1714003200000,
  },
  {
    timestamp: 1714003200000,
  },
]

const MOCK_PROJECT: IProject = {
  id: 'test-project-id',
  name: 'Test Project',
  isPersonal: true,
  ownerId: 'test-user-id',
  maxMembers: 10,
  inviteCode: 'test-invite-code',
  createdAt: new Date().toISOString()
}

const MockProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const mockValue = {
    projects: [MOCK_PROJECT],
    currentProject: MOCK_PROJECT,
    isLoading: false,
    createProject: jest.fn(),
    joinProject: jest.fn(),
    switchProject: jest.fn(),
    fetchProjects: jest.fn(),
    getProjectInviteInfo: jest.fn(),
  }

  return (
    <ProjectContext.Provider value={mockValue}>
      {children}
    </ProjectContext.Provider>
  )
}

const renderNoiseTrackingProvider = () => {
  return render(
    <MockProjectProvider>
      <NoiseTrackingProvider>
        <div>Test</div>
      </NoiseTrackingProvider>
    </MockProjectProvider>
  )
}