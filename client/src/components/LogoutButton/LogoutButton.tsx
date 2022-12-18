import React from 'react';
import Button from '@mui/lab/LoadingButton';
import { MeDocument, useLogoutMutation } from '../../generated/graphql';
import { useStyles } from './styles';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useStore } from '../../store';

const LogoutButton: React.FC = () => {
    const router = useRouter();
    const classes = useStyles();
    const setAccessToken = useStore(state => state.setAccessToken);
    const [logout, { loading }] = useLogoutMutation({
        refetchQueries: [{ query: MeDocument }]
    });

    const handleLogout = async () => {
        const res = await logout();
        if (res.data?.logout) {
            toast.success('Logged out');
            setAccessToken('');
            await router.push('/login');
        } else {
            toast.error('Something went wrong');
        }
    };

    return (
        <Button
            className={classes.btn}
            variant="contained"
            loading={loading}
            onClick={() => handleLogout()}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
