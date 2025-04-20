import { TextField as MuiTextField } from '@mui/material'
import { IFormField } from '../../types'
import { IFieldProps } from '../../hooks/useForm/types'

export interface ITextFieldProps {
    field: IFormField
    fieldProps: IFieldProps
    errors: Record<string, string>
    isSubmitting: boolean
}

export const TextField = ({
    field,
    fieldProps,
    errors,
    isSubmitting
}: ITextFieldProps) => {
    const { name, label, type, required } = field

    return (
        <MuiTextField 
            key={name}
            fullWidth
            label={label}
            {...fieldProps}
            type={type}
            error={!!errors[name]}
            helperText={errors[name]}
            required={required}
            disabled={isSubmitting}
            aria-label={label}
            aria-required={required}
            aria-invalid={!!errors[name]}
        />
    )
}
