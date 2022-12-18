import React from 'react';
import { useUsersQuery } from '../../generated/graphql';
import { Stack, Typography } from '@mui/material';
import Loading from '../Loading/Loading';

const Users: React.FC = () => {
    const { data, loading, error } = useUsersQuery();

    if (loading) {
        return <Loading />;
    }

    if (error || !data) {
        return <p>Something went wrong</p>;
    }

    return (
        <Stack>
            <Typography variant="h4" component="h3" gutterBottom>
                Users
            </Typography>
            <Stack>
                {data.users.map((user, index) => (
                    <Typography>
                        {index + 1}. {user.email}
                    </Typography>
                ))}
            </Stack>
        </Stack>
    );
};

export default Users;
