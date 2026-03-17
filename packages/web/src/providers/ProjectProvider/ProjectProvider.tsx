import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from 'react-oidc-context'
import { IProjectProviderProps } from './types'
import { IProject, IProjectContext, ICreateProjectRequest, IJoinProjectRequest } from '../../types/project'
import { retrieveUserProjects, createProject as createProjectAPI, joinProject as joinProjectAPI, getProjectInviteInfo } from '../../api/projects'
import { getUserPreferences, updateUserPreferences } from '../../api/userPreferences'

export const initialState: IProjectContext = {
  projects: [],
  currentProject: null,
  isLoading: false,
  createProject: async () => ({} as IProject),
  joinProject: async () => {},
  switchProject: async () => {},
  fetchProjects: async () => {},
  getProjectInviteInfo: async () => ({} as any),
}

export const ProjectContext = createContext<IProjectContext>(initialState)

export const useProjectContext = () => useContext(ProjectContext)

export const ProjectProvider = ({ children }: IProjectProviderProps) => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const [projects, setProjects] = useState<IProject[]>([])
  const [currentProject, setCurrentProject] = useState<IProject | null>(null)

  const queryKey = ['projects', auth.user?.access_token]

  const query = useQuery({
    queryKey,
    queryFn: () => Promise.all([
      retrieveUserProjects(auth.user!.access_token),
      getUserPreferences(auth.user!.access_token),
    ]),
    enabled: !!auth.isAuthenticated && !!auth.user?.access_token,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch projects:', query.error)
      setProjects([])
    }
  }, [query.error])

  // Derive projects and currentProject from query data
  useEffect(() => {
    if (!query.data) return

    const [userProjects, userPreferences] = query.data
    setProjects(userProjects)

    if (userPreferences.currentProjectId) {
      const savedProject = userProjects.find((p: IProject) => p.id === userPreferences.currentProjectId)
      if (savedProject) {
        setCurrentProject(savedProject)
        return
      }
    }

    const personalProject = userProjects.find((p: IProject) => p.isPersonal)
    if (personalProject) {
      setCurrentProject(personalProject)
      updateUserPreferences({ currentProjectId: personalProject.id }, auth.user!.access_token)
        .catch((error) => console.error('Failed to save project preference:', error))
    } else if (userProjects.length > 0) {
      setCurrentProject(userProjects[0])
      updateUserPreferences({ currentProjectId: userProjects[0].id }, auth.user!.access_token)
        .catch((error) => console.error('Failed to save project preference:', error))
    }
  }, [query.data, auth.user?.access_token])

  // Clear state when logged out
  useEffect(() => {
    if (!auth.isAuthenticated) {
      setProjects([])
      setCurrentProject(null)
    }
  }, [auth.isAuthenticated])

  const fetchProjects = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const createProject = useCallback(async (request: ICreateProjectRequest): Promise<IProject> => {
    if (!auth.user?.access_token) throw new Error('User not authenticated')

    try {
      const newProject = await createProjectAPI(request, auth.user.access_token)
      setProjects((prev) => [...prev, newProject])
      return newProject
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    }
  }, [auth.user?.access_token])

  const joinProject = useCallback(async (request: IJoinProjectRequest): Promise<void> => {
    if (!auth.user?.access_token) throw new Error('User not authenticated')

    try {
      await joinProjectAPI(request, auth.user.access_token)
      await query.refetch()
    } catch (error) {
      console.error('Failed to join project:', error)
      throw error
    }
  }, [auth.user?.access_token, query.refetch])

  const switchProject = useCallback(async (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project && auth.user?.access_token) {
      setCurrentProject(project)
      try {
        await updateUserPreferences({ currentProjectId: projectId }, auth.user.access_token)
      } catch (error) {
        console.error('Failed to update user preferences:', error)
      }
    }
  }, [projects, auth.user?.access_token])

  const getProjectInviteInfoHandler = useCallback(async (inviteCode: string) => {
    if (!auth.user?.access_token) throw new Error('User not authenticated')

    try {
      return await getProjectInviteInfo(inviteCode, auth.user.access_token)
    } catch (error) {
      console.error('Failed to get project invite info:', error)
      throw error
    }
  }, [auth.user?.access_token])

  const value = useMemo(
    () => ({
      projects,
      currentProject,
      isLoading: query.isLoading,
      createProject,
      joinProject,
      switchProject,
      fetchProjects,
      getProjectInviteInfo: getProjectInviteInfoHandler,
    }),
    [projects, currentProject, query.isLoading, createProject, joinProject, switchProject, fetchProjects, getProjectInviteInfoHandler]
  )

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}
