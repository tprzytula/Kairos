import { IFormField } from "../../components/AddItemForm/types"

export type IValidatedFields = [
    IFormField<string>,
    IFormField<string>
]

export const validateFields = (fields: Array<IFormField>): IValidatedFields => {
  if (fields.length !== 2) {
    throw new Error('Invalid number of fields')
  }

  const [name, description] = fields

  if (!name.value) {
    throw new Error('Name cannot be empty')
  }

  if (typeof name.value !== 'string') {
    throw new Error('Name must be a string')
  }

  if (typeof description.value !== 'string') {
    throw new Error('Description must be a string')
  }

  return [
    { ...name, value: name.value },
    { ...description, value: description.value },
  ];
}
