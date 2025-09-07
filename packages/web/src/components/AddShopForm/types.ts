export interface IAddShopFormProps {
  onSubmit: (name: string, icon?: string) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}
