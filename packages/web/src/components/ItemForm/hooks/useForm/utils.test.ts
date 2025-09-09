import { clearFieldError, createFieldProps, updateFormFields } from "./utils"
import { FormFieldType } from "../../enums"
import { IFormField } from "../../types"

describe('Given the updateFormFields function', () => {
    it('should update the form fields', () => {
        const formFields = updateFormFields({
            prevFields: EXAMPLE_FIELDS,
            name: 'name',
            value: 'test2',
            type: FormFieldType.TEXT
        })

        expect(formFields).toEqual([
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

    describe('When the field is a number', () => {
        it('should update the form fields', () => {
            const formFields = updateFormFields({
                prevFields: EXAMPLE_FIELDS,
                name: 'quantity',
                value: '2',
                type: FormFieldType.NUMBER
            })

            expect(formFields).toEqual([
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
})

describe('Given the clearFieldError function', () => {
    it('should clear the field error', () => {
        const errors = clearFieldError({
            prevErrors: EXAMPLE_ERRORS,
            name: 'name'
        })

        expect(errors).toEqual({
            quantity: 'Quantity must be a number'
        })
    })
})

describe('Given the createFieldProps function', () => {
    it('should create the field props', () => {
        const fieldProps = createFieldProps({
            field: EXAMPLE_FIELDS[0],
            onValueChange: jest.fn(),
            onErrorClear: jest.fn()
        })

        expect(fieldProps).toEqual({
            onChange: expect.any(Function),
            value: 'test'
        })
    })

    describe('When the field has no value', () => {
        it('should create the field props', () => {
            const fieldProps = createFieldProps({
                field: {
                    ...EXAMPLE_FIELDS[0],
                    value: undefined
                },
                onValueChange: jest.fn(),
                onErrorClear: jest.fn()
            })

            expect(fieldProps).toEqual({
                onChange: expect.any(Function),
                value: ''
            })
        })
    })

    describe('When the onChange event is triggered', () => {
        it('should clear the field error', () => {
            const onErrorClear = jest.fn()
            const fieldProps = createFieldProps({
                field: EXAMPLE_FIELDS[0],
                onValueChange: jest.fn(),
                onErrorClear
            })

            fieldProps.onChange({
                target: { value: 'test2' }
            } as React.ChangeEvent<HTMLInputElement>)

            expect(onErrorClear).toHaveBeenCalledWith('name')
        })

        it('should call the onValueChange function', () => {
            const onValueChange = jest.fn()
            const fieldProps = createFieldProps({
                field: EXAMPLE_FIELDS[0],
                onValueChange,
                onErrorClear: jest.fn()
            })

            fieldProps.onChange({
                target: { value: 'test2' }
            } as React.ChangeEvent<HTMLInputElement>)

            expect(onValueChange).toHaveBeenCalledWith(
                'name',
                'test2',
                FormFieldType.TEXT
            )
        })

        describe('When the field is a number', () => {
            it('should call the onValueChange function with the processed value', () => {
                const onValueChange = jest.fn()
                const fieldProps = createFieldProps({
                    field: EXAMPLE_FIELDS[1],
                    onValueChange,
                    onErrorClear: jest.fn()
                })

                fieldProps.onChange({
                    target: { value: '2' }
                } as React.ChangeEvent<HTMLInputElement>)

                expect(onValueChange).toHaveBeenCalledWith(
                    'quantity',
                    2,
                    FormFieldType.NUMBER
                )
            })
        })
    })
})

const EXAMPLE_ERRORS = {
    name: 'Name is required',
    quantity: 'Quantity must be a number'
}

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