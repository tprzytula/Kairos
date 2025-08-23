import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
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
  const [projects, setProjects] = useState<IProject[]>([])
  const [currentProject, setCurrentProject] = useState<IProject | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchProjects = useCallback(async () => {
    if (!auth.isAuthenticated || !auth.user?.access_token) {
      return
    }
    
    try {
      setIsLoading(true)
      const [userProjects, userPreferences] = await Promise.all([
        retrieveUserProjects(auth.user.access_token),
        getUserPreferences(auth.user.access_token)
      ])
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
        await updateUserPreferences({ currentProjectId: personalProject.id }, auth.user.access_token)
      } else if (userProjects.length > 0) {
        setCurrentProject(userProjects[0])
        await updateUserPreferences({ currentProjectId: userProjects[0].id }, auth.user.access_token)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }, [auth.isAuthenticated, auth.user?.access_token])

  const createProject = useCallback(async (request: ICreateProjectRequest): Promise<IProject> => {
    if (!auth.user?.access_token) {
      throw new Error('User not authenticated')
    }
    
    try {
      const newProject = await createProjectAPI(request, auth.user.access_token)
      setProjects(prev => [...prev, newProject])
      return newProject
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    }
  }, [auth.user?.access_token])

  const joinProject = useCallback(async (request: IJoinProjectRequest): Promise<void> => {
    if (!auth.user?.access_token) {
      throw new Error('User not authenticated')
    }
    
    try {
      await joinProjectAPI(request, auth.user.access_token)
      await fetchProjects()
    } catch (error) {
      console.error('Failed to join project:', error)
      throw error
    }
  }, [auth.user?.access_token, fetchProjects])

  const switchProject = useCallback(async (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
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
    if (!auth.user?.access_token) {
      throw new Error('User not authenticated')
    }
    
    try {
      return await getProjectInviteInfo(inviteCode, auth.user.access_token)
    } catch (error) {
      console.error('Failed to get project invite info:', error)
      throw error
    }
  }, [auth.user?.access_token])

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      fetchProjects()
    } else {
      setProjects([])
      setCurrentProject(null)
    }
  }, [auth.isAuthenticated, auth.user?.access_token, fetchProjects])

  const value = useMemo(
    () => ({
      projects,
      currentProject,
      isLoading,
      createProject,
      joinProject,
      switchProject,
      fetchProjects,
      getProjectInviteInfo: getProjectInviteInfoHandler,
    }),
    [projects, currentProject, isLoading, createProject, joinProject, switchProject, fetchProjects, getProjectInviteInfoHandler]
  )

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}
