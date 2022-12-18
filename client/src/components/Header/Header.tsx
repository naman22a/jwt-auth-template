import React from 'react';
import { Link, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useMeQuery } from '../../generated/graphql';
import LogoutButton from '../LogoutButton/LogoutButton';

const Header: React.FC = () => {
    const { data, loading, error } = useMeQuery();
    return (
        <Stack
            px={5}
            py={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
        >
            <Link component={NextLink} href="/">
                <Typography variant="h4">App</Typography>
            </Link>
            <Stack direction="row">
                {loading || error || !data ? (
                    <>
                        <Link component={NextLink} href="/login" mr={4}>
                            Login
                        </Link>
                        <Link component={NextLink} href="/register">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" fontWeight="bold">
                            {data.me?.name}
                        </Typography>
                        <LogoutButton/>
                    </>
                )}
            </Stack>
        </Stack>
    );
};

export default Header;
