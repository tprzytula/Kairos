import { IProjectMemberDetails } from '../../types/projectMemberDetails'

export interface IState {
  members: IProjectMemberDetails[]
  isLoading: boolean
  isError: boolean
  removeMember: (userId: string) => Promise<void>
}

export interface IProjectMembersProviderProps {
  children: React.ReactNode
}
