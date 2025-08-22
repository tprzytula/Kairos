export enum ProjectRole {
  OWNER = 'owner',
  MEMBER = 'member',
}

export interface IProject {
  id: string
  name: string
  ownerId: string
  createdAt: number
  isPersonal: boolean
  inviteCode?: string
  maxMembers?: number
}

export interface IProjectMember {
  projectId: string
  userId: string
  role: ProjectRole
  joinedAt: number
  invitedBy?: string
}

export interface ICreateProjectRequest {
  name: string
  isPersonal?: boolean
}

export interface IJoinProjectRequest {
  inviteCode: string
}

export interface IProjectInviteInfo {
  projectId: string
  projectName: string
  ownerId: string
  memberCount: number
  maxMembers: number
}
