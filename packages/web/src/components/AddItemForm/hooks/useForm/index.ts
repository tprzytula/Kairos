import { useState, useCallback } from 'react';
import { IFormField } from '../../types';
import { validateFields } from '../../utils';
import { createFieldProps, updateFormFields, clearFieldError } from './utils';
import { IUseFormProps, IUseFormReturn } from './types';
import { FormFieldType } from '../../enums';
import { useThrottle } from '../../../../hooks/useThrottle';

export const useForm = ({
    initialFields,
    onValueChange,
    onSubmit
}: IUseFormProps): IUseFormReturn => {
    const [formFields, setFormFields] = useState<IFormField[]>(initialFields);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleFieldValueChange = useCallback((name: string, value: string | number, type: FormFieldType) => {
        onValueChange(name, value, type);
        setFormFields(prevFields => updateFormFields({ prevFields, name, value, type }));
    }, [onValueChange]);

    const handleErrorClear = useCallback((name: string) => {
        setErrors(prevErrors => clearFieldError({ prevErrors, name }));
    }, []);

    const getFieldProps = useCallback(
        (field: IFormField) => createFieldProps({
            field,
            onValueChange: handleFieldValueChange,
            onErrorClear: handleErrorClear
        }),
        [handleFieldValueChange, handleErrorClear]
    );

    const submitForm = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
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

    const handleSubmit = useThrottle(submitForm, 1000);

    return {
        formFields,
        errors,
        isSubmitting,
        submitError,
        getFieldProps,
        handleSubmit
    };
}; 