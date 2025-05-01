import { Button, Container, Stack, CircularProgress, Alert, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { useCallback, useMemo } from "react";
import { IAddItemFormProps, IFormField } from "./types";
import { useForm } from "./hooks/useForm";
import { TextField } from "./components/TextField";
import { Select } from "./components/Select";
import { FormFieldType } from "./enums";
import { GroceryItemImage } from "./index.styled";

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
        
        if (field.type === FormFieldType.SELECT) {
            return (
                <Select
                    key={field.name}
                    field={field}
                    fieldProps={fieldProps}
                    errors={errors}
                    isSubmitting={isSubmitting}
                />
            );
        }

        return (
            <TextField 
                key={field.name}
                field={field}
                fieldProps={fieldProps}
                errors={errors}
                isSubmitting={isSubmitting}
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
                    <GroceryItemImage
                        image={'/assets/images/generic-grocery-item.png'}
                    />
                    {formFieldsComponents}
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    {submitError && (
                        <Alert severity="error" role="alert">
                            {submitError}
                        </Alert>
                    )}
                </Stack>
            </form>
        </Container>
    );
};

export default AddItemForm;
