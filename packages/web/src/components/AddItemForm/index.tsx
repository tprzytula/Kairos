import { Button, Container, Stack, CircularProgress, Alert } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IAddItemFormProps, IFormField, IIcon } from "./types";
import { useForm } from "./hooks/useForm";
import { TextField } from "./components/TextField";
import { Select } from "./components/Select";
import { FormFieldType } from "./enums";
import { GroceryItemImage } from "./index.styled";
import { retrieveGroceryListIcons } from "../../api/groceryList";

const DEFAULT_ICON = '/assets/images/generic-grocery-item.png';

const AddItemForm = ({ fields, onSubmit }: IAddItemFormProps) => {
    const [imagePath, setImagePath] = useState<string>(DEFAULT_ICON);
    const [icons, setIcons] = useState<Array<IIcon>>([]);

    useEffect(() => {
        const fetchIcons = async () => {
            const icons = await retrieveGroceryListIcons();
            setIcons(icons);
        };
        fetchIcons();
    }, []);

    const handleValueChange = useCallback((name: string, value: string | number) => {
        if (name === 'name') {
            const icon = icons.find((icon) => value.toString().toLowerCase().includes(icon.name.toLowerCase()));

            if (icon) {
                setImagePath(icon.path);
            } else {
                setImagePath(DEFAULT_ICON);
            }
        }
    }, [icons]);

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
                    <GroceryItemImage
                        image={imagePath}
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
