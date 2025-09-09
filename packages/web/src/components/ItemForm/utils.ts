import { IFormField, IUpdateFieldValueParams } from "./types";
import { FormFieldType } from "./enums";

export const updateFieldValue = ({ prevFields, name, value, type }: IUpdateFieldValueParams) => 
    prevFields.map(field => field.name === name ? { 
        ...field, 
        value: getProcessedValue(value, type)
    } : field);

export const validateFields = (fields: Array<IFormField>) => {
    return fields.reduce((acc, field) => {
        const error = validateField(field, String(field.value ?? ''));

        if (error) {
            acc[field.name] = error;
        }
        return acc;
    }, {} as Record<string, string>);
}

const getProcessedValue = (value: string | number, type: FormFieldType) => 
    type === FormFieldType.NUMBER && typeof value === 'string' ? parseInt(value) : value;

const validateField = (field: IFormField, value: string): string | undefined => {
    if ((!value) && field.required) {
        return `${field.label} is required`;
    }

    if (field.type === FormFieldType.NUMBER && (isNaN(Number(value)) || Number(value) < 1)) {
        return `${field.label} must be a number greater than 0`;
    }

    if (field.validate) {
        return field.validate(value);
    }

    return undefined;
};