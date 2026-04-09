export interface IRemoveMemberDialogProps {
  open: boolean
  memberName: string
  onClose: () => void
  onConfirm: () => Promise<void>
}
