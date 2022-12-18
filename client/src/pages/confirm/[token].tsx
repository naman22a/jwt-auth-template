import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useConfirmEmailMutation } from '../../generated/graphql';
import { Button, Container, Stack, Typography } from '@mui/material';
import { useStyles } from '../../styles/confirmEmail';
import toast from 'react-hot-toast';

const ConfirmEmail: React.FC = () => {
    const router = useRouter();
    const token = router.query.token as string;
    const [confirmEmail] = useConfirmEmailMutation();

    const handleConfirmEmail = async () => {
        const res = await confirmEmail({ variables: { token } });

        if (res.data?.confirmEmail.ok && !res.data.confirmEmail.errors) {
            toast.success('Email confirmed successfully !');
            router.push('/login');
        } else {
            toast.error('Something went wrong');
        }
    };

    const classes = useStyles();

    return (
        <Container maxWidth="lg">
            <Head>
                <title>Confirm Email</title>
            </Head>
            <Stack alignItems="center" mt={6}>
                <Typography variant="h3" component="h2" fontWeight="bold">
                    Confirm Email
                </Typography>
                <Button
                    className={classes.btn}
                    variant="contained"
                    size="large"
                    onClick={() => handleConfirmEmail()}
                >
                    Confirm Email
                </Button>
            </Stack>
        </Container>
    );
};

export default ConfirmEmail;
