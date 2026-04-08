export interface ILeaveProjectDialogProps {
  open: boolean
  projectName: string
  onClose: () => void
  onConfirm: () => void
}
