import { render, screen, fireEvent, act } from '@testing-library/react'
import AddItemForm from './index'
import { IFormField } from './types'
import { FormFieldType } from './enums'
import { useForm } from './hooks/useForm'

jest.mock('./hooks/useForm');

describe('Given the AddItemForm component', () => {
    it('should render the form fields', () => {
        mockUseForm();
        renderAddItemForm();

        expect(screen.getAllByLabelText('Name')[0]).toBeVisible()
        expect(screen.getAllByLabelText('Name')[0]).toHaveValue('test')
        expect(screen.getAllByLabelText('Quantity')[0]).toBeVisible()
        expect(screen.getAllByLabelText('Quantity')[0]).toHaveValue(1)
    }) 

    it('should pass the initial fields to the useForm hook', () => {
        mockUseForm();
        const { onSubmit } = renderAddItemForm();

        expect(jest.mocked(useForm)).toHaveBeenCalledWith({
            initialFields: EXAMPLE_FIELDS,
            onSubmit
        })
    })

    describe('When the form is submitted', () => {
        it('should call the handleSubmit function', async () => {
            const { handleSubmitMock } = mockUseForm();
            
            renderAddItemForm();

            await submitForm()

            expect(handleSubmitMock).toHaveBeenCalled()
        })
    })

    describe('When there is form submission error', () => {
        it('should render the error message', async () => {
            mockUseForm({ submitError: 'An error occurred while submitting the form' });
            
            renderAddItemForm();

            await submitForm()

            expect(screen.getByText('An error occurred while submitting the form')).toBeVisible()
        })
    })

    describe('When the form is submitting', () => {
        it('should render the submit button as disabled', () => {
            mockUseForm({ isSubmitting: true });
            renderAddItemForm();
            
            expect(screen.getByText('Submitting...')).toBeDisabled()
        })

        it('should show circular progress', () => {
            mockUseForm({ isSubmitting: true });
            renderAddItemForm();
            
            expect(screen.getByRole('progressbar')).toBeVisible()
        })
    })
})

const mockUseForm = ({
    isSubmitting = false,
    submitError = null
}: {
    isSubmitting?: boolean,
    submitError?: string | null
} = {}) => {
    const useFormMock = jest.mocked(useForm);
    const getFieldPropsMock = jest.fn().mockImplementation((field: IFormField) => ({
        onChange: jest.fn(),
        value: field.value
    }));
    const handleSubmitMock = jest.fn().mockImplementation((e) => {
        e.preventDefault();
        return Promise.resolve();
    });

    useFormMock.mockReturnValue({
        errors: {},
        formFields: EXAMPLE_FIELDS,
        getFieldProps: getFieldPropsMock,
        handleSubmit: handleSubmitMock,
        isSubmitting,
        submitError,
    })

    return { getFieldPropsMock, handleSubmitMock, useFormMock }
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
