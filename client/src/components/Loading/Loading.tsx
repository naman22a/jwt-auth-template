import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

const Loading: React.FC = () => {
    return (
        <Stack height="100vh" alignItems="center" justifyContent="center">
            <CircularProgress size="100px" />
        </Stack>
    );
};

export default Loading;
