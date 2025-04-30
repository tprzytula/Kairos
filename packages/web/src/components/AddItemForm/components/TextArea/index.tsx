import { TextField as MuiTextField } from "@mui/material";
import { IFormField } from "../../types";
import { IFieldProps } from "../../hooks/useForm/types";

export interface ITextAreaProps {
    field: IFormField
    fieldProps: IFieldProps
    errors: Record<string, string>
    isSubmitting: boolean
    placeholder?: string
}

export const TextArea = ({ field, fieldProps, errors, isSubmitting, placeholder }: ITextAreaProps) => {
    const error = errors[field.name];
    
    return (
        <MuiTextField
            {...fieldProps}
            multiline
            rows={4}
            fullWidth
            label={field.label}
            error={!!error}
            helperText={error}
            disabled={isSubmitting}
            placeholder={placeholder}
        />
    );
};
