import { ProjectRole } from './project'

export interface IProjectMemberDetails {
  userId: string
  name: string
  givenName?: string
  avatar?: string
  role: ProjectRole
}
