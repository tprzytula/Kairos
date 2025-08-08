import { IFormField } from "../../components/AddItemForm/types"

export type IValidatedFields = [
    IFormField<string>,
    IFormField<number>,
    IFormField<string>
]

export const validateFields = (fields: Array<IFormField>): IValidatedFields => {
  if (fields.length !== 3) {
    throw new Error('Invalid number of fields')
  }

  const [name, quantity, unit] = fields

  if (!name.value || !quantity.value || !unit.value) {
    throw new Error('Fields cannot be empty')
  }

  if (typeof name.value !== 'string') {
    throw new Error('Invalid name field type')
  }

  if (typeof quantity.value !== 'number') {
    throw new Error('Invalid quantity field type')
  }

  if (typeof unit.value !== 'string') {
    throw new Error('Invalid unit field type')
  }

  return [
    { ...name, value: name.value },
    { ...quantity, value: quantity.value },
    { ...unit, value: unit.value }
  ];
}