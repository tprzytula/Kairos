import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { IFormField } from '../../types'
import { IFieldProps } from '../../hooks/useForm/types'
import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface IDatePickerProps {
    field: IFormField
    fieldProps: IFieldProps
    errors: Record<string, string>
    isSubmitting: boolean
}

const DatePickerComponent = ({
    field,
    fieldProps,
    errors,
    isSubmitting
}: IDatePickerProps) => {
    const { name, label, required } = field
    const { value, onChange } = fieldProps

    return (
        <MuiDatePicker
            label={label}
            value={value ? dayjs(value) : null}
            onChange={(newValue) => {
                const syntheticEvent = new Event('change', { bubbles: true }) as unknown as React.ChangeEvent<HTMLInputElement>
                Object.defineProperty(syntheticEvent, 'target', {
                    writable: true,
                    value: {
                        name,
                        value: newValue ? newValue.valueOf() : ''
                    }
                })
                onChange(syntheticEvent)
            }}
            disabled={isSubmitting}
            slotProps={{
                textField: {
                    fullWidth: true,
                    error: !!errors[name],
                    helperText: errors[name],
                    required: required,
                    'aria-label': label,
                    'aria-required': required,
                    'aria-invalid': !!errors[name]
                }
            }}
        />
    )
}

export const DatePicker = (props: IDatePickerProps) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePickerComponent {...props} />
        </LocalizationProvider>
    )
}
