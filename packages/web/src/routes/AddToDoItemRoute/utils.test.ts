import { FormFieldType } from "../../components/AddItemForm/enums"
import { validateFields } from "./utils"

describe('Given the validateFields function', () => {
  describe('When the fields are valid', () => {
    it('should return the fields', () => {
      const fields = validateFields([
        { 
          name: 'Name', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: 'Test',
          label: 'Name'
        }, 
        { 
          name: 'Description', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: 'Test',
          label: 'Description'
        },
      ])
            
      expect(fields).toEqual([
        { 
          name: 'Name', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: 'Test', 
          label: 'Name' 
        }, 
        { 
          name: 'Description', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: 'Test', 
          label: 'Description' 
        },
      ])
    })
  })

  describe('When there are not enough fields', () => {
    it('should throw an error', () => {
      expect(() => validateFields([
        { 
          name: 'Name', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: 'Test',
          label: 'Name'
        }
      ])).toThrow('Invalid number of fields')
    })
  })

  describe('When the name has no value', () => {
    it('should throw an error', () => {
      expect(() => validateFields([
        { 
          name: 'Name', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: '', 
          label: 'Name'
        },
        { 
          name: 'Description', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: '', 
          label: 'Description'
        },
      ])).toThrow('Name cannot be empty')
    })
  })

  describe('When the name is not a string', () => {
    it('should throw an error', () => {
      expect(() => validateFields([
        { 
          name: 'Name', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: 1, 
          label: 'Name' 
        },
        { 
          name: 'Description', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: 'Test', 
          label: 'Description' 
        },
      ])).toThrow('Name must be a string')
    })
  })

  describe('When the description is not a string', () => {
    it('should throw an error', () => {
      expect(() => validateFields([
        { 
          name: 'Name', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: 'Test', 
          label: 'Name' 
        },
        { 
          name: 'Description', 
          type: FormFieldType.TEXT, 
          required: true, 
          value: 1, 
          label: 'Description' 
        },
      ])).toThrow('Description must be a string')
    })
  })
})
