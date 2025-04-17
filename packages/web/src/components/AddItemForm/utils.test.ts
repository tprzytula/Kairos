import { FormFieldType } from "./enums"
import { updateFieldValue, validateFields } from "./utils"
import { IFormField } from "./types"

const EXAMPLE_FIELDS: Array<IFormField> = [
    {
        name: 'name',
        value: 'test',
        type: FormFieldType.TEXT,
        label: 'Name'
    },
    {
        name: 'quantity',
        value: 1,
        type: FormFieldType.NUMBER,
        label: 'Quantity'
    }
]

describe('Given the updateFieldValue function', () => {
    it('should update the value of the field', () => {
        const updatedFields = updateFieldValue({
            prevFields: EXAMPLE_FIELDS,
            name: 'name',
            value: 'test2',
            type: FormFieldType.TEXT
        })

        expect(updatedFields).toStrictEqual([
            {
                name: 'name',
                value: 'test2',
                type: FormFieldType.TEXT,
                label: 'Name'
            },
            {
                name: 'quantity',
                value: 1,
                type: FormFieldType.NUMBER,
                label: 'Quantity'
            }
        ])
    })

    it('should update the value of the field to a number', () => {
        const updatedFields = updateFieldValue({
            prevFields: EXAMPLE_FIELDS,
            name: 'quantity',
            value: '2',
            type: FormFieldType.NUMBER
        })

        expect(updatedFields).toStrictEqual([
            {
                name: 'name',
                value: 'test',
                type: FormFieldType.TEXT,
                label: 'Name'
            },
            {
                name: 'quantity',
                value: 2,
                type: FormFieldType.NUMBER,
                label: 'Quantity'
            }
        ])
    })
})

describe('Given the validateFields function', () => {
    describe('When the fields are valid', () => {
        it('should return an empty object if the fields are valid', () => {
            const fields = [
                {
                    name: 'name',
                    value: 'test',
                    type: FormFieldType.TEXT,
                    label: 'Name'
                },
                {
                    name: 'quantity',
                    value: 1,
                    type: FormFieldType.NUMBER,
                    label: 'Quantity'
                }
            ]

            const errors = validateFields(fields)

            expect(errors).toStrictEqual({})
        })
    })

    describe('When the fields are invalid', () => {
        it('should return an error if the empty field is required', () => {
            const fields = [
                {
                    name: 'name',
                    value: undefined,
                    type: FormFieldType.TEXT,
                    label: 'Name',
                    required: true
                }
            ]

            const errors = validateFields(fields)

            expect(errors).toStrictEqual({
                name: 'Name is required'
            })
        })

        it('should return an error if the field is not a number', () => {
            const fields = [
                {
                    name: 'quantity',
                    value: 'not a number',
                    type: FormFieldType.NUMBER,
                    label: 'Quantity'
                }
            ]

            const errors = validateFields(fields)

            expect(errors).toStrictEqual({
                quantity: 'Quantity must be a number'
            })
        })
    })

    describe('When the field has a custom validator', () => {
        it('should return the error from the custom validator', () => {
            const fields = [
                {
                    name: 'quantity',
                    value: 5,
                    type: FormFieldType.NUMBER,
                    label: 'Quantity',
                    validate: () => 'Something went wrong'
                }
            ]

            const errors = validateFields(fields)

            expect(errors).toStrictEqual({
                quantity: 'Something went wrong'
            })
        })
    })
})