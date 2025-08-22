import { IProject } from '../../types/project'

export interface ICreateProjectDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: (project: IProject) => void
}
