import { Alert, MenuItem, SelectChangeEvent, Select as MuiSelect } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { ISelectProps } from './types';
import { StyledFormControl, StyledInputLabel } from './index.styled';

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
        <StyledFormControl 
            key={name}
            fullWidth
            error={!!errors[name]}
            disabled={isSubmitting}
        >
            <StyledInputLabel>{label}</StyledInputLabel>
            <MuiSelect
                label={label}
                value={fieldProps.value}
                required={required}
                aria-label={label}
                aria-required={required}
                aria-invalid={!!errors[name]}
                onChange={handleChange}
                sx={{
                    '& .MuiSelect-icon': {
                        color: 'text.secondary',
                        transition: 'transform 0.2s ease',
                    },
                    '&.Mui-focused .MuiSelect-icon': {
                        color: '#667eea',
                        transform: 'rotate(180deg)',
                    },
                }}
            >
                {menuItems}
            </MuiSelect>
            {alert}
        </StyledFormControl>
    );
};
