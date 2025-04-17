import { FormFieldType } from "./enums";

export interface IFormField {
    name: string;
    type: FormFieldType;
    label: string;
    value?: string | number;
    required?: boolean;
    validate?: (value: string) => string | undefined;
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
