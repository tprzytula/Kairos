import { IFormField } from "../../components/AddItemForm/types"

export type IValidatedFields = [
    IFormField<string>,
    IFormField<number>
]

export const validateFields = (fields: Array<IFormField>): IValidatedFields => {
  if (fields.length !== 2) {
    throw new Error('Invalid number of fields')
  }

  const [name, quantity] = fields

  if (!name.value || !quantity.value) {
    throw new Error('Fields cannot be empty')
  }

  if (typeof name.value !== 'string' || typeof quantity.value !== 'number') {
    throw new Error('Invalid field types')
  }

  return [
    { ...name, value: name.value },
    { ...quantity, value: quantity.value }
  ];
}
