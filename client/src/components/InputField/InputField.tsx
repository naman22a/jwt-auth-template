import React, { InputHTMLAttributes, LegacyRef } from 'react';
import { FormControl, TextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';

type Props = TextFieldProps &
    InputHTMLAttributes<HTMLInputElement> & {
        name: string;
        label: string;
        ref?: LegacyRef<HTMLInputElement> | undefined;
    };

const InputField: React.FC<Props> = ({ label, ...props }) => {
    const [field, { error }] = useField(props);
    return (
        <FormControl>
            <TextField
                {...field}
                {...props}
                sx={{ my: '10px' }}
                label={label}
                autoComplete="off"
                error={!!error}
                helperText={error}
            />
        </FormControl>
    );
};

export default InputField;
