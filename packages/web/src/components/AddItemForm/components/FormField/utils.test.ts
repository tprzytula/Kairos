import { getFieldComponent } from "./utils";
import { TextField } from "../TextField";
import { Select } from "../Select";
import { TextArea } from "../TextArea";
import { DatePicker } from "../DatePicker";

describe('Given the getFieldComponent function', () => {
    describe('When the type is a valid field type', () => {
        test.each([
            ['text', TextField],
            ['number', TextField],
            ['select', Select],
            ['textarea', TextArea],
            ['date', DatePicker],
        ])('should return the corresponding component for %s', (type, expectedComponent) => {
            expect(getFieldComponent(type)).toBe(expectedComponent);
        });
    });

    describe('When the type is an invalid field type', () => {
        it('should return null', () => {
            expect(getFieldComponent('invalid')).toBeNull();
        });
    });
});
