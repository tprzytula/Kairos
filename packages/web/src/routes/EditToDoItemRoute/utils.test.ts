import { validateFields } from './utils'
import { FormFieldType } from '../../components/ItemForm/enums'

describe('Given the validateFields function', () => {
  it('should validate and return correctly formatted fields', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: 'Test Todo'
      },
      {
        name: 'description',
        label: 'Description',
        type: FormFieldType.TEXT,
        required: false,
        value: 'Test description'
      },
      {
        name: 'dueDate',
        label: 'Due Date',
        type: FormFieldType.DATE,
        required: false,
        value: 1234567890
      }
    ]

    const result = validateFields(fields)

    expect(result).toHaveLength(3)
    expect(result[0].value).toBe('Test Todo')
    expect(result[1].value).toBe('Test description')
    expect(result[2].value).toBe(1234567890)
  })

  it('should validate fields with empty optional fields', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: 'Test Todo'
      },
      {
        name: 'description',
        label: 'Description',
        type: FormFieldType.TEXT,
        required: false,
        value: ''
      },
      {
        name: 'dueDate',
        label: 'Due Date',
        type: FormFieldType.DATE,
        required: false,
        value: undefined
      }
    ]

    const result = validateFields(fields)

    expect(result).toHaveLength(3)
    expect(result[0].value).toBe('Test Todo')
    expect(result[1].value).toBe('')
    expect(result[2].value).toBeUndefined()
  })

  it('should throw error when number of fields is incorrect', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: 'Test Todo'
      }
    ]

    expect(() => validateFields(fields)).toThrow('Invalid number of fields')
  })

  it('should throw error when name is empty', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: ''
      },
      {
        name: 'description',
        label: 'Description',
        type: FormFieldType.TEXT,
        required: false,
        value: 'Test description'
      },
      {
        name: 'dueDate',
        label: 'Due Date',
        type: FormFieldType.DATE,
        required: false,
        value: undefined
      }
    ]

    expect(() => validateFields(fields)).toThrow('Name cannot be empty')
  })

  it('should throw error when name field type is invalid', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: 123
      },
      {
        name: 'description',
        label: 'Description',
        type: FormFieldType.TEXT,
        required: false,
        value: 'Test description'
      },
      {
        name: 'dueDate',
        label: 'Due Date',
        type: FormFieldType.DATE,
        required: false,
        value: undefined
      }
    ]

    expect(() => validateFields(fields)).toThrow('Name must be a string')
  })

      it('should throw error when description field type is invalid', () => {
    const fields = [
      {
        name: 'name',
        label: 'Name',
        type: FormFieldType.TEXT,
        required: true,
        value: 'Test Todo'
      },
      {
        name: 'description',
        label: 'Description',
        type: FormFieldType.TEXT,
        required: false,
        value: 123
      },
      {
        name: 'dueDate',
        label: 'Due Date',
        type: FormFieldType.DATE,
        required: false,
        value: undefined
      }
    ]

    expect(() => validateFields(fields)).toThrow('Description must be a string')
  })
})