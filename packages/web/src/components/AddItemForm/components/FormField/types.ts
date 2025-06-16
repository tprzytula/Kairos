import { IFormField } from "../../types";

export interface IFormFieldProps {
    field: IFormField;
    getFieldProps: (field: IFormField) => any;
    errors: Record<string, string>;
    isSubmitting: boolean;
}
