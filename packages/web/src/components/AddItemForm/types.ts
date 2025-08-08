import { FormFieldType } from "./enums";
import { IItemDefault } from "../../hooks/useItemDefaults/types";

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
    defaults?: Array<IItemDefault>;
    fields: Array<IFormField>
    hideImage?: boolean;
    initialImagePath?: string;
    onSubmit: (fields: Array<IFormField>, icon?: string) => Promise<void>;
}

export interface IHandleChangeParams {
    name: string;
    value: string | number;
    type: FormFieldType;
}

export type IUpdateFieldValueParams = IHandleChangeParams & {
    prevFields: Array<IFormField>;
}

export interface IIcon {
    name: string;
    path: string;
}
