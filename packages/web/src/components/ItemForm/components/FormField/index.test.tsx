import { render, screen } from '@testing-library/react';
import { IFormField } from "../../types";
import FormField from "./index";
import { FormFieldType } from "../../enums";

describe('Given the FormField component', () => {
    describe('When the field type is valid', () => {
        it('should render the corresponding component', () => {
            const field: IFormField = {
                type: FormFieldType.TEXT,
                name: 'test',
                label: 'Test Field',
                value: ''
            };
            const getFieldProps = mockGetFieldProps;
            const errors = {};
            const isSubmitting = false;

            render(<FormField field={field} getFieldProps={getFieldProps} errors={errors} isSubmitting={isSubmitting} />);

            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
    });

    describe('When the field type is invalid', () => {
        it('should return null', () => {
            const field: IFormField = {
                type: 'invalid' as FormFieldType,
                name: 'test',
                label: 'Test Field',
                value: ''
            };
            const getFieldProps = mockGetFieldProps;
            const errors = {};
            const isSubmitting = false;

            const { container } = render(
                <FormField field={field} getFieldProps={getFieldProps} errors={errors} isSubmitting={isSubmitting} />
            );
            
            expect(container.firstChild).toBeNull();
        });
    });
});

const mockGetFieldProps = jest.fn().mockImplementation((field: IFormField) => ({
    onChange: jest.fn(),
    value: field.value
}));