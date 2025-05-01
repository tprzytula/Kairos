import { Button, Container, TextField, Stack, CircularProgress, Alert } from "@mui/material";
import { useCallback, useMemo } from "react";
import { IAddItemFormProps, IFormField } from "./types";
import { useForm } from "./hooks/useForm";

const AddItemForm = ({ fields, onSubmit }: IAddItemFormProps) => {
    const {
        errors,
        formFields,
        getFieldProps,
        handleSubmit,
        isSubmitting,
        submitError
    } = useForm({
        initialFields: fields,
        onSubmit
    });

    const renderFormField = useCallback((field: IFormField) => {
        const fieldProps = getFieldProps(field);
        
        return (
            <TextField 
                key={field.name}
                fullWidth
                label={field.label}
                {...fieldProps}
                type={field.type}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                required={field.required}
                disabled={isSubmitting}
                aria-label={field.label}
                aria-required={field.required}
                aria-invalid={!!errors[field.name]}
            />
        );
    }, [errors, getFieldProps, isSubmitting]);

    const formFieldsComponents = useMemo(() => (
        <Stack spacing={2}>
            {formFields.map(renderFormField)}
        </Stack>
    ), [formFields, renderFormField]);

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={3}>
                    {submitError && (
                        <Alert severity="error" role="alert">
                            {submitError}
                        </Alert>
                    )}
                    {formFieldsComponents}
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </Stack>
            </form>
        </Container>
    );
};

export default AddItemForm;
