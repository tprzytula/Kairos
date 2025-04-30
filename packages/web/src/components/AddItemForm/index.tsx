import { Button, Container, Stack, CircularProgress, Alert } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IAddItemFormProps, IFormField } from "./types";
import { useForm } from "./hooks/useForm";
import { TextField } from "./components/TextField";
import { Select } from "./components/Select";
import { FormFieldType } from "./enums";
import { GroceryItemImage } from "./index.styled";

const AddItemForm = ({ defaults, fields, onSubmit }: IAddItemFormProps) => {
    const [imagePath, setImagePath] = useState<string | undefined>();

    const findItemIcon = useCallback((name: string) => {
        const defaultItem = defaults?.find((defaultItem) => name.toLowerCase().includes(defaultItem.name.toLowerCase()));

        if (defaultItem && defaultItem.icon) {
            return defaultItem.icon;
        }

        return undefined;
    }, [defaults]);

    useEffect(() => {
        const defaultIcon = findItemIcon('generic');

        if (defaultIcon) {
            setImagePath(defaultIcon);
            return;
        }
    }, [findItemIcon]);

    const handleValueChange = useCallback((name: string, value: string | number) => {
        if (name === 'name') {
            const icon = findItemIcon(value.toString());

            if (icon) {
                setImagePath(icon);
                return;
            }

            const genericIcon = findItemIcon('generic');

            if (genericIcon) {
                setImagePath(genericIcon);
            }
        }
    }, [defaults, findItemIcon]);

    const handleOnSubmit = useCallback(async (fields: Array<IFormField>) => {
        onSubmit(fields, imagePath);
    }, [onSubmit, imagePath]);     

    const {
        errors,
        formFields,
        getFieldProps,
        handleSubmit,
        isSubmitting,
        submitError,
    } = useForm({
        initialFields: fields,
        onSubmit: handleOnSubmit,
        onValueChange: handleValueChange
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
                    { imagePath ? <GroceryItemImage
                        image={imagePath}
                    /> : null}
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
