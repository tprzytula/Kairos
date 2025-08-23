export interface IProject {
  id: string
  ownerId: string
  name: string
  isPersonal: boolean
  maxMembers: number
  inviteCode: string
  createdAt: string
}

export interface IProjectMember {
  projectId: string
  userId: string
  role: ProjectRole
  joinedAt: string
}

export enum ProjectRole {
  OWNER = 'owner',
  MEMBER = 'member'
}

export interface ICreateProjectRequest {
  name: string
  maxMembers?: number
}

export interface IJoinProjectRequest {
  inviteCode: string
}

export interface IProjectInviteInfo {
  id: string
  name: string
  memberCount: number
  maxMembers: number
  ownerName?: string
}

export interface IProjectContext {
  projects: IProject[]
  currentProject: IProject | null
  isLoading: boolean
  createProject: (request: ICreateProjectRequest) => Promise<IProject>
  joinProject: (request: IJoinProjectRequest) => Promise<void>
  switchProject: (projectId: string) => Promise<void>
  fetchProjects: () => Promise<void>
  getProjectInviteInfo: (inviteCode: string) => Promise<IProjectInviteInfo>
}
