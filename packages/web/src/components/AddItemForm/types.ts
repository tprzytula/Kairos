import { FormFieldType } from "./enums";

export interface IFormField<T extends string | number | undefined = string | number | undefined> {
    name: string;
    type: FormFieldType;
    label: string;
    value: T;
    required?: boolean;
    validate?: (value: T) => string | undefined;
    options?: Array<{ label: string; value: string }>;
}

export interface IAddItemFormProps {
    fields: Array<IFormField>
    onSubmit: (fields: Array<IFormField>) => Promise<void>;
}

export interface IHandleChangeParams {
    name: string;
    value: string | number;
    type: FormFieldType;
}

export type IUpdateFieldValueParams = IHandleChangeParams & {
    prevFields: Array<IFormField>;
}
