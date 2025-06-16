import { Button, Container, Stack, CircularProgress, Alert } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { IAddItemFormProps, IFormField } from "./types";
import { useForm } from "./hooks/useForm";
import { TextField } from "./components/TextField";
import { Select } from "./components/Select";
import { FormFieldType } from "./enums";
import { TextArea } from "./components/TextArea";
import { DatePicker } from "./components/DatePicker";
import ItemImage from "./components/ItemImage";

const FIELD_TYPE_COMPONENTS = {
    [FormFieldType.TEXT]: TextField,
    [FormFieldType.NUMBER]: TextField,
    [FormFieldType.SELECT]: Select,
    [FormFieldType.TEXTAREA]: TextArea,
    [FormFieldType.DATE]: DatePicker,
}

const isFieldComponent = (type: string): type is keyof typeof FIELD_TYPE_COMPONENTS => {
    return type in FIELD_TYPE_COMPONENTS;
}

const AddItemForm = ({ defaults, fields, onSubmit }: IAddItemFormProps) => {
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

    const renderFormField = useCallback((field: IFormField) => {
        const fieldProps = getFieldProps(field);
        const FieldComponent = isFieldComponent(field.type) ? FIELD_TYPE_COMPONENTS[field.type] : null;

        if (FieldComponent) {
            return (
                <FieldComponent
                    key={field.name}
                    field={field}
                    fieldProps={fieldProps}
                    errors={errors}
                    isSubmitting={isSubmitting}
                />
            );
        }
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
                    <ItemImage
                        itemName={itemName}
                        defaults={defaults}
                        onChange={setImagePath}
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
