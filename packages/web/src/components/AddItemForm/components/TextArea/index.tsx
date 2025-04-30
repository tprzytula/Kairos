import { TextField as MuiTextField } from "@mui/material";
import { IFormFieldComponentProps } from "../../types";

export const TextArea = ({ field, fieldProps, errors, isSubmitting }: IFormFieldComponentProps) => {
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
            placeholder={field.placeholder}
        />
    );
}; 