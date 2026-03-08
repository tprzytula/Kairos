import { IFormField } from "../../components/ItemForm/types"

export type IValidatedFields = [
    IFormField<string>,
    IFormField<number>,
    IFormField<string>,
    IFormField<string>
]

export const validateFields = (fields: Array<IFormField>): IValidatedFields => {
  if (fields.length !== 4) {
    throw new Error('Invalid number of fields')
  }

  const [name, quantity, unit, shopField] = fields

  if (!name.value || !quantity.value || !unit.value || !shopField.value) {
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

  if (typeof shopField.value !== 'string') {
    throw new Error('Invalid shop field type')
  }

  return [
    { ...name, value: name.value },
    { ...quantity, value: quantity.value },
    { ...unit, value: unit.value },
    { ...shopField, value: shopField.value }
  ];
}
