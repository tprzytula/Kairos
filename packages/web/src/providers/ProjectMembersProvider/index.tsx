import { createContext, useContext, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useProjectContext } from '../ProjectProvider'
import { getProjectMembersDetails } from '../../api/projects/getMembers'
import { IState, IProjectMembersProviderProps } from './types'

const initialState: IState = {
  members: [],
  isLoading: false,
  isError: false,
}

export const ProjectMembersContext = createContext<IState>(initialState)

export const useProjectMembersContext = () => useContext(ProjectMembersContext)

export const ProjectMembersProvider = ({ children }: IProjectMembersProviderProps) => {
  const { currentProject } = useProjectContext()

  const query = useQuery({
    queryKey: ['projectMembers', currentProject?.id],
    queryFn: () => getProjectMembersDetails(currentProject!.id),
    enabled: !!currentProject,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch project members:', query.error)
    }
  }, [query.error])

  const value = useMemo(
    () => ({
      members: query.data ?? [],
      isLoading: query.isPending,
      isError: query.isError,
    }),
    [query.data, query.isPending, query.isError],
  )

  return (
    <ProjectMembersContext.Provider value={value}>
      {children}
    </ProjectMembersContext.Provider>
  )
}
