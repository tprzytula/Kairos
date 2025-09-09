import { FormFieldType } from "../../components/ItemForm/enums"
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
          name: 'Quantity', 
          type: FormFieldType.NUMBER, 
          required: true, 
          value: 1,
          label: 'Quantity'
        },
        {
          name: 'GroceryItemUnit',
          type: FormFieldType.SELECT,
          required: true,
          value: 'kg',
          label: 'GroceryItemUnit'
        }
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
          name: 'Quantity', 
          type: FormFieldType.NUMBER, 
          required: true, 
          value: 1, 
          label: 'Quantity' 
        },
        {
          name: 'GroceryItemUnit',
          type: FormFieldType.SELECT,
          required: true,
          value: 'kg',
          label: 'GroceryItemUnit'
        }
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
          name: 'Quantity', 
          type: FormFieldType.NUMBER, 
          required: true, 
          value: 1, 
          label: 'Quantity'
        },
        {
          name: 'GroceryItemUnit',
          type: FormFieldType.SELECT,
          required: true,
          value: 'kg',
          label: 'GroceryItemUnit'
        }
      ])).toThrow('Fields cannot be empty')
    })
  })

  describe('When the quantity has no value', () => {
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
          name: 'Quantity', 
          type: FormFieldType.NUMBER, 
          required: true, 
          value: 0, 
          label: 'Quantity' 
        },
        {
          name: 'GroceryItemUnit',
          type: FormFieldType.SELECT,
          required: true,
          value: 'kg',
          label: 'GroceryItemUnit'
        }
      ])).toThrow('Fields cannot be empty')
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
          name: 'Quantity', 
          type: FormFieldType.NUMBER, 
          required: true, 
          value: 1, 
          label: 'Quantity' 
        },
        {
          name: 'GroceryItemUnit',
          type: FormFieldType.SELECT,
          required: true,
          value: 'kg',
          label: 'GroceryItemUnit'
        }
      ])).toThrow('Invalid field types')
    })
  })

  describe('When the quantity is not a number', () => {
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
          name: 'Quantity', 
          type: FormFieldType.NUMBER, 
          required: true, 
          value: 'Test', 
          label: 'Quantity' 
        },
        {
          name: 'GroceryItemUnit',
          type: FormFieldType.SELECT,
          required: true,
          value: 'kg',
          label: 'GroceryItemUnit'
        }
      ])).toThrow('Invalid field types')
    })
  })
})