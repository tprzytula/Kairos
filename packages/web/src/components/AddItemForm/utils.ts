import { IFormField, IUpdateFieldValueParams } from "./types";
import { FormFieldType } from "./enums";

const getProcessedValue = (value: string | number, type: FormFieldType) => 
    type === FormFieldType.NUMBER && typeof value === 'string' ? parseInt(value) : value;

export const updateFieldValue = ({ prevFields, name, value, type }: IUpdateFieldValueParams) => 
    prevFields.map(field => field.name === name ? { 
        ...field, 
        value: getProcessedValue(value, type)
    } : field);


export const validateFields = (fields: Array<IFormField>) => {
    return fields.reduce((acc, field) => {
        const error = validateField(field, String(field.value || ''));
        if (error) {
                acc[field.name] = error;
            }
        return acc;
    }, {} as Record<string, string>);
}

export const validateField = (field: IFormField, value: string): string | undefined => {
    if (!value && field.required) {
        return `${field.label} is required`;
    }

    if (field.type === FormFieldType.NUMBER && isNaN(Number(value))) {
        return `${field.label} must be a number`;
    }

    if (field.validate) {
        return field.validate(value);
    }

    return undefined;
};