import { createTheme } from '@mui/material';

const theme = createTheme({
    components: {
        MuiLink: {
            defaultProps: {
                color: 'inherit',
                underline: 'none'
            }
        }
    }
});

export default theme;
