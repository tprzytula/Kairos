import { useCallback } from 'react'

interface UsePreviewDrawerActionsProps<T extends { id: string }> {
  item: T | null
  onEdit?: (item: T) => void
  onDelete?: (id: string) => void
  onClose: () => void
  closeOnEdit?: boolean
}

export const usePreviewDrawerActions = <T extends { id: string }>({
  item,
  onEdit,
  onDelete,
  onClose,
  closeOnEdit = true,
}: UsePreviewDrawerActionsProps<T>) => {
  const handleEdit = useCallback(() => {
    if (!item || !onEdit) return
    onEdit(item)
    if (closeOnEdit) onClose()
  }, [item, onEdit, onClose, closeOnEdit])

  const handleDelete = useCallback(() => {
    if (!item || !onDelete) return
    onDelete(item.id)
    onClose()
  }, [item, onDelete, onClose])

  return { handleEdit, handleDelete }
}
