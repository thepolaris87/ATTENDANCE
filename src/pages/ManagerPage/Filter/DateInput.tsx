import { TextField, TextFieldProps } from '@mui/material';

export default function DateInput({ params }: { params: TextFieldProps }) {
    const { inputProps, InputProps } = params;

    return (
        <TextField
            variant='filled'
            {...{
                ...params,
                inputProps: { ...inputProps, sx: { pt: 1, pl: 1, pb: 1 } },
                InputProps: { ...InputProps, sx: { background: '#fff', fontSize: '14px' } }
            }}
        />
    );
}
