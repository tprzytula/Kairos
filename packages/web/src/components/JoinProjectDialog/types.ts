import { IProjectInviteInfo } from '../../types/project'

export interface IJoinProjectDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export interface IInviteCodeInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  autoFocus?: boolean
}

export interface IProjectPreviewProps {
  projectInfo: IProjectInviteInfo
  isLoading: boolean
}
