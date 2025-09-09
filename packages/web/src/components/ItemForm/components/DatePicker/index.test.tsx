import { render, screen, within } from '@testing-library/react'
import { DatePicker } from '.'
import { IFormField } from '../../types'
import { FormFieldType } from '../../enums'
import { IFieldProps } from '../../hooks/useForm/types'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const renderDatePicker = () => {
    return render(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                field={EXAMPLE_FIELD}
                fieldProps={EXAMPLE_FIELD_PROPS}
                errors={EXAMPLE_ERRORS}
                isSubmitting={false}
            />
        </LocalizationProvider>
    )
}

describe('Given the DatePicker component', () => {
    it('should render with the correct label', () => {
        renderDatePicker()
        const field = screen.getByLabelText('Due Date')
        expect(field).toBeVisible()
    })

    describe('When there is an error', () => {
        it('should render the error message', () => {
            renderDatePicker()
            expect(screen.getByText('Due Date is required')).toBeVisible()
        })
    })

    describe('When the field is required', () => {
        it('should show the required indicator', () => {
            renderDatePicker()
            const field = screen.getByLabelText('Due Date')
            expect(field).toHaveAttribute('aria-required', 'true')
        })
    })
})

const EXAMPLE_FIELD: IFormField = {
    name: "dueDate",
    label: "Due Date",
    type: FormFieldType.DATE,
    value: "2024-03-20",
    required: true
}

const EXAMPLE_FIELD_PROPS: IFieldProps = {
    onChange: jest.fn(),
    value: new Date('2024-03-20').getTime()
}

const EXAMPLE_ERRORS: Record<string, string> = {
    dueDate: "Due Date is required"
}
