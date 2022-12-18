import React from 'react';
import Head from 'next/head';
import { CircularProgress, Container, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
    useLoginMutation,
    useForgotPasswordMutation
} from '../generated/graphql';
import { HandleSubmit, LoginInfo } from '../interfaces';
import { useRouter } from 'next/router';
import { mapToErrors } from '../utils';
import { Formik, Form, FormikHelpers } from 'formik';
import { InputField } from '../components';
import { useStore } from '../store';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
    const router = useRouter();
    const [login] = useLoginMutation();
    const [forgotPassword, { loading }] = useForgotPasswordMutation();
    const setAccessToken = useStore(state => state.setAccessToken);

    const handleSubmit: HandleSubmit<LoginInfo> = async (
        values,
        { setErrors }
    ) => {
        const res = await login({
            variables: { loginDto: values }
        });

        if (res.data?.login.accessToken && !res.data.login.errors) {
            toast.success('Logged in');
            setAccessToken(res.data.login.accessToken);
            router.push('/');
        } else {
            setErrors(mapToErrors(res.data?.login.errors!));
        }
    };

    const handleForgotPassword = async (
        email: string,
        setErrors: FormikHelpers<LoginInfo>['setErrors']
    ) => {
        const res = await forgotPassword({ variables: { email } });

        if (res.data?.forgotPassword.ok && !res.data.forgotPassword.errors) {
            toast.success('Please check your email');
        } else {
            setErrors(mapToErrors(res.data?.forgotPassword.errors!));
        }
    };

    return (
        <Container maxWidth="lg">
            <Head>
                <title>Login</title>
            </Head>
            <Stack alignItems="center" mt={6}>
                <Typography
                    variant="h3"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                >
                    Login
                </Typography>
                <Formik
                    initialValues={
                        {
                            email: '',
                            password: ''
                        } as LoginInfo
                    }
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setErrors, values: { email } }) => (
                        <Form>
                            <Stack>
                                <InputField
                                    name="email"
                                    label="Email"
                                    type="email"
                                />
                                <InputField
                                    name="password"
                                    label="Password"
                                    type="password"
                                />

                                {loading ? (
                                    <CircularProgress size="30px" />
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="primary"
                                        fontWeight="bold"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() =>
                                            handleForgotPassword(
                                                email,
                                                setErrors
                                            )
                                        }
                                    >
                                        Forgot Password ?
                                    </Typography>
                                )}

                                <LoadingButton
                                    type="submit"
                                    loading={isSubmitting}
                                    variant="contained"
                                    size="large"
                                    sx={{ marginTop: '15px' }}
                                >
                                    Login
                                </LoadingButton>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Stack>
        </Container>
    );
};

export default Login;
