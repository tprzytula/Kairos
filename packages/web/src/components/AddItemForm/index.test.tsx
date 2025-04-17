import { render, screen, fireEvent, act } from '@testing-library/react'
import AddItemForm from './index'
import { IFormField } from './types'
import { FormFieldType } from './enums'

describe('Given the AddItemForm component', () => {
    it('should render the form fields', () => {
        renderAddItemForm();

        expect(screen.getAllByLabelText('Name')[0]).toBeVisible()
        expect(screen.getAllByLabelText('Name')[0]).toHaveValue('test')
        expect(screen.getAllByLabelText('Quantity')[0]).toBeVisible()
        expect(screen.getAllByLabelText('Quantity')[0]).toHaveValue(1)
    })

    describe('When the form is submitted', () => {
        it('should call the onSubmit function', async () => {
            const { onSubmit } = renderAddItemForm();

            await submitForm()

            expect(onSubmit).toHaveBeenCalledWith(EXAMPLE_FIELDS)
        })

        describe('And there were changes in the form fields', () => {
            it('should call the onSubmit function with the updated fields', async () => {
                const { onSubmit } = renderAddItemForm();

                await changeField(EXAMPLE_FIELDS[0], 'test2')
                await changeField(EXAMPLE_FIELDS[1], 10)

                await submitForm()

                expect(onSubmit).toHaveBeenCalledWith([
                    { name: 'name', label: 'Name', type: 'text', value: 'test2' },
                    { name: 'quantity', label: 'Quantity', type: 'number', value: 10 },
                ])
            })
        })
    })
})

const changeField = async (field: IFormField, value: string | number) => {
    await act(async () => {
        fireEvent.change(screen.getAllByLabelText(field.label)[0], { target: { value } })
    })
}

const submitForm = async () => {
    await act(async () => {
        fireEvent.click(screen.getByText('Submit'))
    })
}

const renderAddItemForm = () => {
    const onSubmit = jest.fn()
    const component = render(<AddItemForm fields={EXAMPLE_FIELDS} onSubmit={onSubmit} />)

    return { ...component, onSubmit }
}

const EXAMPLE_FIELDS: Array<IFormField> = [
    { name: 'name', label: 'Name', type: FormFieldType.TEXT, value: 'test' },
    { name: 'quantity', label: 'Quantity', type: FormFieldType.NUMBER, value: 1 },
]
