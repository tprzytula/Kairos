export interface IProjectInviteDisplayProps {
  inviteCode: string
  projectName: string
  onCopySuccess?: () => void
  onShareSuccess?: () => void
  compact?: boolean
}

export interface IInviteCodeDisplayProps {
  code: string
  compact?: boolean
}

export interface IShareOption {
  label: string
  icon: React.ReactNode
  action: (inviteCode: string, projectName: string) => void
  color: string
}
