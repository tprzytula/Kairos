export interface IAddShopFormProps {
  onSubmit: (name: string, icon?: string, isPrivate?: boolean) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}
