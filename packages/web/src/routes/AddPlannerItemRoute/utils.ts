import { IFormField } from "../../components/ItemForm/types"

export type IValidatedFields = [
    IFormField<string>,
    IFormField<string>,
    IFormField<string | number | undefined>
]

export const validateFields = (fields: Array<IFormField>): IValidatedFields => {
  if (fields.length !== 3) {
    throw new Error('Invalid number of fields')
  }

  const [name, description, dueDate] = fields

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
    { ...dueDate, value: dueDate?.value },
  ];
}
