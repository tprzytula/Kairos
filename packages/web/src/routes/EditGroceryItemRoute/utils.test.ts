import { validateFields } from './utils'
import { FormFieldType } from '../../components/AddItemForm/enums'

describe('validateFields', () => {
  it('should validate fields correctly when all fields are valid', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: 'Test Item',
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: FormFieldType.NUMBER,
        required: true,
        value: 2,
      },
      {
        name: 'unit',
        label: 'Unit',
        type: FormFieldType.SELECT,
        required: true,
        value: 'kg',
      },
    ]

    const result = validateFields(fields)

    expect(result).toEqual([
      expect.objectContaining({ name: 'name', value: 'Test Item' }),
      expect.objectContaining({ name: 'quantity', value: 2 }),
      expect.objectContaining({ name: 'unit', value: 'kg' }),
    ])
  })

  it('should throw error when invalid number of fields', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: 'Test Item',
      },
    ]

    expect(() => validateFields(fields)).toThrow('Invalid number of fields')
  })

  it('should throw error when fields are empty', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: '',
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: FormFieldType.NUMBER,
        required: true,
        value: 2,
      },
      {
        name: 'unit',
        label: 'Unit',
        type: FormFieldType.SELECT,
        required: true,
        value: 'kg',
      },
    ]

    expect(() => validateFields(fields)).toThrow('Fields cannot be empty')
  })

  it('should throw error when field types are invalid', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: 123 as any,
      },
      {
        name: 'quantity',
        label: 'Quantity',
        type: FormFieldType.NUMBER,
        required: true,
        value: 2,
      },
      {
        name: 'unit',
        label: 'Unit',
        type: FormFieldType.SELECT,
        required: true,
        value: 'kg',
      },
    ]

    expect(() => validateFields(fields)).toThrow('Invalid name field type')
  })
})