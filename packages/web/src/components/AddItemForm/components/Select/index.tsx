import { Alert, FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectChangeEvent } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { ISelectProps } from './types';

export const Select = ({
    field,
    fieldProps,
    errors,
    isSubmitting
}: ISelectProps) => {
    const { name, label, required, options } = field;

    const handleChange = useCallback((event: SelectChangeEvent<string | number>) => {
        const syntheticEvent = {
            target: {
                value: event.target.value,
                name
            }
        } as React.ChangeEvent<HTMLInputElement>;
        fieldProps.onChange(syntheticEvent);
    }, [name, fieldProps]);

    const menuItems = useMemo(() => 
        options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        )), [options]);

    const alert = useMemo(() => {
        if (errors[name]) {
            return <Alert severity="error" sx={{ mt: 1 }}>{errors[name]}</Alert>
        }
        return null;
    }, [errors, name]);

    return (
        <FormControl 
            key={name}
            fullWidth
            error={!!errors[name]}
            disabled={isSubmitting}
        >
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                label={label}
                {...fieldProps}
                required={required}
                aria-label={label}
                aria-required={required}
                aria-invalid={!!errors[name]}
                onChange={handleChange}
            >
                {menuItems}
            </MuiSelect>
            {alert}
        </FormControl>
    );
};
