import { IProjectMemberDetails } from '../../types/projectMemberDetails'

export interface IState {
  members: IProjectMemberDetails[]
  isLoading: boolean
  isError: boolean
}

export interface IProjectMembersProviderProps {
  children: React.ReactNode
}
