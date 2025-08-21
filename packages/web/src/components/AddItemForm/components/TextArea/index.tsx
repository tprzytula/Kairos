import { IFormField } from "../../types";
import { IFieldProps } from "../../hooks/useForm/types";
import { StyledTextField } from "../TextField/index.styled";

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
        <StyledTextField
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
