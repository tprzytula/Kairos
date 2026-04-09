import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from 'react-oidc-context'
import { useProjectContext } from '../ProjectProvider'
import { getProjectMembersDetails } from '../../api/projects/getMembers'
import { removeProjectMember } from '../../api/projects/removeMember'
import { IState, IProjectMembersProviderProps } from './types'

const initialState: IState = {
  members: [],
  isLoading: false,
  isError: false,
  removeMember: async () => {},
}

export const ProjectMembersContext = createContext<IState>(initialState)

export const useProjectMembersContext = () => useContext(ProjectMembersContext)

export const ProjectMembersProvider = ({ children }: IProjectMembersProviderProps) => {
  const { currentProject } = useProjectContext()
  const auth = useAuth()
  const queryClient = useQueryClient()

  const queryKey = ['projectMembers', currentProject?.id]

  const query = useQuery({
    queryKey,
    queryFn: () => getProjectMembersDetails(currentProject!.id),
    enabled: !!currentProject,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch project members:', query.error)
    }
  }, [query.error])

  const removeMember = useCallback(
    async (userId: string): Promise<void> => {
      if (!currentProject) throw new Error('No project selected')

      await removeProjectMember(userId, currentProject.id, auth.user?.access_token)
      await queryClient.invalidateQueries({ queryKey })
    },
    [currentProject, auth.user?.access_token, queryClient, queryKey],
  )

  const value = useMemo(
    () => ({
      members: query.data ?? [],
      isLoading: query.isPending,
      isError: query.isError,
      removeMember,
    }),
    [query.data, query.isPending, query.isError, removeMember],
  )

  return (
    <ProjectMembersContext.Provider value={value}>
      {children}
    </ProjectMembersContext.Provider>
  )
}
