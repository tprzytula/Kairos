import { IGroceryItem } from '../../providers/AppStateProvider/types'

export interface IGroceryItemPreviewPopupProps {
  open: boolean
  onClose: () => void
  item: IGroceryItem | null
  anchorPosition?: {
    top: number
    left: number
    arrowOffset?: number
  }
}
