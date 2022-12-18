import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container, Typography } from '@mui/material';
import { Loading, Users } from '../components';
import { useMeQuery } from '../generated/graphql';

const Index: NextPage = () => {
    const router = useRouter();
    const { data, loading, error } = useMeQuery();

    if (loading) {
        return <Loading />;
    }

    if (error || !data) {
        router.push('/login');
        return null;
    }

    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom>
                Home page
            </Typography>
            <Users />
        </Container>
    );
};

export default Index;
