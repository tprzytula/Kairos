import { Button, Container, Stack, CircularProgress, Alert } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { IAddItemFormProps, IFormField } from "./types";
import { useForm } from "./hooks/useForm";
import ItemImage from "./components/ItemImage";
import FormField from "./components/FormField";

const AddItemForm = ({ defaults, fields, hideImage, initialImagePath, onSubmit }: IAddItemFormProps) => {
    const [itemName, setItemName] = useState<string | undefined>();
    const [imagePath, setImagePath] = useState<string | undefined>();

    const handleValueChange = useCallback((name: string, value: string | number) => {
        if (name === 'name') {
            setItemName(value.toString());
        }
    }, [setItemName]);

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

    const formFieldsComponents = useMemo(() => 
        formFields.map((field) => (
            <FormField 
                key={field.name} 
                field={field} 
                getFieldProps={getFieldProps} 
                errors={errors} 
                isSubmitting={isSubmitting} 
            />
        ))
    , [formFields, getFieldProps, errors, isSubmitting]);

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={3}>
                    {!hideImage && (
                        <ItemImage
                            itemName={itemName}
                            defaults={defaults}
                            initialImagePath={initialImagePath}
                            onChange={setImagePath}
                        />
                    )}
                    <Stack spacing={2}>
                        {formFieldsComponents}
                    </Stack>
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
