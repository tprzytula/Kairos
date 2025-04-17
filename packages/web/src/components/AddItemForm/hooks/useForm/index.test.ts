import { useForm } from "."
import { act, renderHook, waitFor } from "@testing-library/react"
import { IFormField } from "../../types"
import { FormFieldType } from "../../enums"

describe('Given the useForm hook', () => {
    it('should return the form fields', () => {
        const { result } = renderHook(() => useForm({
            initialFields: EXAMPLE_FIELDS,
            onSubmit: jest.fn()
        }))

        expect(result.current.formFields).toEqual(EXAMPLE_FIELDS)
    })

    describe('When the form is submitted', () => {
        it('should call the onSubmit function', async () => {
            const event = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>
            const onSubmit = jest.fn()
            const { result } = renderHook(() => useForm({
                initialFields: EXAMPLE_FIELDS,
                onSubmit
            }))

            await act(async () => {
                result.current.handleSubmit(event)
            })

            expect(onSubmit).toHaveBeenCalledWith(EXAMPLE_FIELDS)
            expect(event.preventDefault).toHaveBeenCalled()
        })

        it('should set the isSubmitting state to true', async () => {
            const event = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>
            const onSubmit = jest.fn().mockImplementation(() => new Promise(() => {}))
            const { result } = renderHook(() => useForm({
                initialFields: EXAMPLE_FIELDS,
                onSubmit
            }))

            await act(async () => {
                result.current.handleSubmit(event)
            })

            expect(result.current.isSubmitting).toBe(true)
        })

        describe('And the fields are invalid', () => {
            it('should not call the onSubmit function', async () => {
                const event = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>
                const onSubmit = jest.fn()
                const { result } = renderHook(() => useForm({
                    initialFields: [
                        EXAMPLE_FIELDS[0],
                        {
                            ...EXAMPLE_FIELDS[1],
                            value: 'not a number'
                        }
                    ],
                    onSubmit
                }))

                await act(async () => {
                    result.current.handleSubmit(event)
                })

                expect(onSubmit).not.toHaveBeenCalled()
            })

            it('should set the errors state to the errors', async () => {
                const event = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>
                const onSubmit = jest.fn()
                const { result } = renderHook(() => useForm({
                    initialFields: [
                        EXAMPLE_FIELDS[0],
                        {
                            ...EXAMPLE_FIELDS[1],
                            value: 'not a number'
                        }
                    ],
                    onSubmit
                }))
                
                await act(async () => {
                    result.current.handleSubmit(event)
                })

                expect(result.current.errors).toEqual({
                    quantity: 'Quantity must be a number'
                })
            })

            describe('And the onChange event is triggered for the field', () => {
                it('should clear the field error', async () => {
                    const event = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>
                    const onSubmit = jest.fn()
                    const { result } = renderHook(() => useForm({
                        initialFields: [
                            EXAMPLE_FIELDS[0],
                            {
                                ...EXAMPLE_FIELDS[1],
                                value: 'not a number'
                            }
                        ],
                        onSubmit
                    }))
                    
                    await act(async () => {
                        result.current.handleSubmit(event)
                    })
    
                    expect(result.current.errors).toEqual({
                        quantity: 'Quantity must be a number'
                    })

                    await act(async () => {
                        result.current.getFieldProps(EXAMPLE_FIELDS[1]).onChange({
                            target: { value: '5' }
                        } as React.ChangeEvent<HTMLInputElement>)
                    })

                    expect(result.current.errors).toEqual({})
                })
            })
        })

        describe('And the submit completed', () => {
            it('should set the isSubmitting state to false', async () => {
                const event = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>
                const onSubmit = jest.fn().mockImplementation(() => Promise.resolve())
                const { result } = renderHook(() => useForm({
                    initialFields: EXAMPLE_FIELDS,
                    onSubmit
                }))

                await act(async () => {
                    result.current.handleSubmit(event)
                })

                expect(result.current.isSubmitting).toBe(false)
            })
        })

        describe('And the submit failed', () => {
            it('should set the submitError state to the error message', async () => {
                const event = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>
                const onSubmit = jest.fn().mockImplementation(() => Promise.reject(new Error('Error')))
                const { result } = renderHook(() => useForm({
                    initialFields: EXAMPLE_FIELDS,
                    onSubmit
                }))

                await act(async () => {
                    result.current.handleSubmit(event)
                })

                expect(result.current.submitError).toBe('Error')
            })

            describe('And the error is not an instance of Error', () => {
                it('should set the submitError state to the error message', async () => {
                    const event = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>
                    const onSubmit = jest.fn().mockImplementation(() => Promise.reject('Error'))
                    const { result } = renderHook(() => useForm({
                        initialFields: EXAMPLE_FIELDS,
                        onSubmit
                    }))

                    await act(async () => {
                        result.current.handleSubmit(event)
                    })

                    expect(result.current.submitError).toBe('An error occurred while submitting the form')
                })
            })
        })
    })

    describe('When the field value changes', () => {
        it('should update the form fields', async () => {
            const { result } = renderHook(() => useForm({
                initialFields: EXAMPLE_FIELDS,
                onSubmit: jest.fn()
            }))

            await act(async () => {
                result.current.getFieldProps(EXAMPLE_FIELDS[1]).onChange({
                    target: { value: '100' }
                } as React.ChangeEvent<HTMLInputElement>)
            })

            expect(result.current.formFields[1].value).toBe(100)
        })
    })
})
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