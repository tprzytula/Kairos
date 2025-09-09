import { Stack, CircularProgress, Alert } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { IItemFormProps, IFormField } from "./types";
import { useForm } from "./hooks/useForm";
import ItemImage from "./components/ItemImage";
import FormField from "./components/FormField";
import { FormContainer, FormCard, FormContent, FormFieldsContainer, SubmitButton, ImageContainer } from "./index.styled";

const ItemForm = ({ defaults, fields, hideImage, initialImagePath, onSubmit, submitButtonText = 'Add Item', submittingButtonText = 'Adding Item...' }: IItemFormProps) => {
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
        <FormContainer>
            <FormCard>
                <FormContent>
                    <form onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2.5}>
                            {!hideImage && (
                                <ImageContainer>
                                    <ItemImage
                                        itemName={itemName}
                                        defaults={defaults}
                                        initialImagePath={initialImagePath}
                                        onChange={setImagePath}
                                    />
                                </ImageContainer>
                            )}
                            <FormFieldsContainer>
                                {formFieldsComponents}
                            </FormFieldsContainer>
                            <SubmitButton 
                                type="submit" 
                                variant="contained" 
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                fullWidth
                            >
                                {isSubmitting ? submittingButtonText : submitButtonText}
                            </SubmitButton>
                            {submitError && (
                                <Alert severity="error" role="alert" sx={{ borderRadius: '12px' }}>
                                    {submitError}
                                </Alert>
                            )}
                        </Stack>
                    </form>
                </FormContent>
            </FormCard>
        </FormContainer>
    );
};

export default ItemForm;
