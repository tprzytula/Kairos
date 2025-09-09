import { FormFieldType } from "../../enums";
import { TextField } from "../TextField";
import { Select } from "../Select";
import { TextArea } from "../TextArea";
import { DatePicker } from "../DatePicker";

export const FIELD_TYPE_COMPONENTS = {
    [FormFieldType.TEXT]: TextField,
    [FormFieldType.NUMBER]: TextField,
    [FormFieldType.SELECT]: Select,
    [FormFieldType.TEXTAREA]: TextArea,
    [FormFieldType.DATE]: DatePicker,
}

const isFieldComponent = (type: string): type is keyof typeof FIELD_TYPE_COMPONENTS => type in FIELD_TYPE_COMPONENTS;

export const getFieldComponent = (type: string) => isFieldComponent(type) ? FIELD_TYPE_COMPONENTS[type] : null;
