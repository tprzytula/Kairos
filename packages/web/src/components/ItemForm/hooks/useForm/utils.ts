import { IFormField, IUpdateFieldValueParams } from '../../types';
import { ClearFieldErrorParams, CreateFieldPropsParams } from './types';
import { FormFieldType } from '../../enums';

const processValue = (value: string | number, type: FormFieldType): string | number => 
    type === FormFieldType.NUMBER ? parseInt(String(value)) : value;

export const updateFormFields = ({
    prevFields,
    name,
    value,
    type
}: IUpdateFieldValueParams): Array<IFormField> => 
    prevFields.map(field => 
        field.name === name ? { 
            ...field, 
            value: processValue(value, type),
            type 
        } : field
    );

export const clearFieldError = ({
    prevErrors,
    name
}: ClearFieldErrorParams): Record<string, string> => {
    const newErrors = { ...prevErrors };
    delete newErrors[name];
    return newErrors;
};

export const createFieldProps = ({
    field,
    onValueChange,
    onErrorClear
}: CreateFieldPropsParams) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
        const value = event.target.value;
        onErrorClear(field.name);
        
        const processedValue = field.type === FormFieldType.NUMBER 
            ? Number(value) 
            : value;

        onValueChange(field.name, processedValue as string | number, field.type);
    };

    return {
        onChange: handleChange,
        value: field.value || '',
    };
};
