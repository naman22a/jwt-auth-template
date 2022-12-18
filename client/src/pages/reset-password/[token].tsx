import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container, Stack, Typography } from '@mui/material';
import { useResetPasswordMutation } from '../../generated/graphql';
import { Form, Formik } from 'formik';
import { HandleSubmit } from '../../interfaces';
import { InputField } from '../../components';
import { toast } from 'react-hot-toast';
import { mapToErrors } from '../../utils';
import LoadingButton from '@mui/lab/LoadingButton';

const ResetPassword: React.FC = () => {
    const router = useRouter();
    const token = router.query.token as string;
    const [resetPassword] = useResetPasswordMutation();

    const handleSubmit: HandleSubmit<{ password: string }> = async (
        values,
        { setErrors }
    ) => {
        const { password } = values;

        const res = await resetPassword({
            variables: { resetPasswordDto: { token, password } }
        });

        if (res.data?.resetPassword.ok && !res.data.resetPassword.errors) {
            router.push('/');
        } else {
            const tokenErrors = res.data?.resetPassword.errors?.filter(
                error => error.field === 'token'
            );

            if (tokenErrors!.length > 0) {
                toast.error('Something went wrong');
            } else {
                setErrors(mapToErrors(res.data?.resetPassword.errors!));
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Head>
                <title>Reset Password</title>
            </Head>
            <Stack alignItems="center" mt={6}>
                <Typography
                    variant="h3"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                >
                    Reset Password
                </Typography>
                <Formik
                    initialValues={{ password: '' }}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Stack>
                                <InputField
                                    name="password"
                                    label="Password"
                                    type="password"
                                />
                                <LoadingButton
                                    loading={isSubmitting}
                                    type="submit"
                                    variant="contained"
                                    sx={{ marginTop: '15px', fontSize: '15px' }}
                                >
                                    Reset Password
                                </LoadingButton>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Stack>
        </Container>
    );
};

export default ResetPassword;
