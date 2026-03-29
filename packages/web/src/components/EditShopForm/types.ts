export interface IEditShopFormProps {
  shopId: string
  initialName: string
  initialIcon?: string
  initialVisibility?: string
  onSubmit: (shopId: string, name: string, icon?: string, isPrivate?: boolean) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}
