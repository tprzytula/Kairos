import { IFormFieldProps } from "./types";
import { getFieldComponent } from "./utils";

const FormField = ({ field, getFieldProps, errors, isSubmitting }: IFormFieldProps) => {
    const fieldProps = getFieldProps(field);
    const FieldComponent = getFieldComponent(field.type);

    if (!FieldComponent) {
        return null;
    }

    return (
        <FieldComponent 
            key={field.name} 
            field={field} 
            fieldProps={fieldProps} 
            errors={errors} 
            isSubmitting={isSubmitting} 
        />
    );
}

export default FormField;
