import { IFormField } from "../../types";
import { FormFieldType } from "../../enums";
export interface IUseFormProps {
    initialFields: Array<IFormField>,
    onValueChange: (name: string, value: string | number, type: FormFieldType) => void,
    onSubmit: (fields: Array<IFormField>) => Promise<void>
}

export interface IFieldProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
}

export interface IUseFormReturn {
    errors: Record<string, string>,
    formFields: Array<IFormField>,
    getFieldProps: (field: IFormField) => IFieldProps,
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
    isSubmitting: boolean,
    submitError: string | null
}

export interface UpdateFormFieldsParams {
    prevFields: Array<IFormField>;
    name: string;
    value: string | number;
}

export interface ClearFieldErrorParams {
    prevErrors: Record<string, string>;
    name: string;
}

export interface CreateFieldPropsParams {
    field: IFormField;
    onValueChange: (name: string, value: string | number, type: FormFieldType) => void;
    onErrorClear: (name: string) => void;
}
