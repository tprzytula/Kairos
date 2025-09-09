import { IFieldProps } from "../../hooks/useForm/types";
import { IFormField } from "../../types";

export interface ISelectProps {
    field: IFormField;
    fieldProps: IFieldProps;
    errors: Record<string, string>;
    isSubmitting: boolean;
}
