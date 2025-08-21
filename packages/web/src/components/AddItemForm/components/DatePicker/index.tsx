import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { IFormField } from '../../types'
import { IFieldProps } from '../../hooks/useForm/types'
import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

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
            format="DD/MM/YYYY"
            slotProps={{
                textField: {
                    fullWidth: true,
                    error: !!errors[name],
                    helperText: errors[name],
                    required: required,
                    'aria-label': label,
                    'aria-required': required,
                    'aria-invalid': !!errors[name],
                    sx: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '& fieldset': {
                                borderColor: 'rgba(102, 126, 234, 0.2)',
                                borderWidth: '1px',
                                transition: 'all 0.3s ease',
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgba(102, 126, 234, 0.4)',
                                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#667eea',
                                borderWidth: '2px',
                                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)',
                            },
                            '&.Mui-error fieldset': {
                                borderColor: 'error.main',
                                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.2)',
                            },
                            '&.Mui-disabled': {
                                background: 'rgba(248, 250, 252, 0.5)',
                                opacity: 0.7,
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'text.secondary',
                            fontWeight: '500',
                            '&.Mui-focused': {
                                color: '#667eea',
                                fontWeight: '600',
                            },
                            '&.Mui-error': {
                                color: 'error.main',
                            },
                        },
                        '& .MuiOutlinedInput-input': {
                            padding: '14px 16px',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            color: 'text.primary',
                        },
                        '& .MuiFormHelperText-root': {
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            marginLeft: '4px',
                            marginTop: '6px',
                            '&.Mui-error': {
                                color: 'error.main',
                            },
                        },
                    }
                }
            }}
        />
    )
}

export const DatePicker = (props: IDatePickerProps) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DatePickerComponent {...props} />
        </LocalizationProvider>
    )
}
