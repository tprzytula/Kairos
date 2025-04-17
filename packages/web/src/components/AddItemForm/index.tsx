import { Button, Container, TextField, Stack, CircularProgress, Alert } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { IAddItemFormProps, IFormField } from "./types";
import { updateFieldValue, validateFields } from "./utils";
import { FormFieldType } from "./enums";

const AddItemForm = ({ fields, onSubmit }: IAddItemFormProps) => {
    const [formFields, setFormFields] = useState<Array<IFormField>>(fields);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError(null);
        
        const newErrors = validateFields(formFields);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit([...formFields]);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'An error occurred while submitting the form'
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [formFields, onSubmit]);

    const handleFieldValueChange = useCallback((field: IFormField) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field.name];
            return newErrors;
        });
        
        setFormFields(prevFields => updateFieldValue({ 
            name: field.name, 
            prevFields, 
            type: field.type, 
            value: field.type === FormFieldType.NUMBER ? Number(value) : value
        }));
    }, []);

    const renderFormField = useCallback((field: IFormField) => (
        <TextField 
            key={field.name}
            fullWidth
            label={field.label}
            onChange={handleFieldValueChange(field)}
            type={field.type}
            value={field.value || ''}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            required={field.required}
            disabled={isSubmitting}
            aria-label={field.label}
            aria-required={field.required}
            aria-invalid={!!errors[field.name]}
        />
    ), [errors, handleFieldValueChange, isSubmitting]);

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
