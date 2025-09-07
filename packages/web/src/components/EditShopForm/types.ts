export interface IEditShopFormProps {
  shopId: string
  initialName: string
  initialIcon?: string
  onSubmit: (shopId: string, name: string, icon?: string) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}
