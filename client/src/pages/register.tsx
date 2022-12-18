import React from 'react';
import Head from 'next/head';
import { Container, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRegisterMutation } from '../generated/graphql';
import { HandleSubmit, RegisterInfo } from '../interfaces';
import { useRouter } from 'next/router';
import { mapToErrors } from '../utils';
import { Formik, Form } from 'formik';
import { InputField } from '../components';

const Register: React.FC = () => {
    const [register] = useRegisterMutation();
    const router = useRouter();

    const handleSubmit: HandleSubmit<RegisterInfo> = async (
        values,
        { setErrors }
    ) => {
        const { name, email, password, cpassword } = values;

        if (password !== cpassword) {
            setErrors({
                cpassword: 'Passwords must be same'
            });
            return;
        }

        const res = await register({
            variables: { registerDto: { name, email, password } }
        });

        if (res.data?.register.ok && !res.data.register.errors) {
            router.push('/login');
        } else {
            setErrors(mapToErrors(res.data?.register.errors!));
        }
    };

    return (
        <Container maxWidth="lg">
            <Head>
                <title>Register</title>
            </Head>
            <Stack alignItems="center" mt={6}>
                <Typography
                    variant="h3"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                >
                    Register
                </Typography>
                <Formik
                    initialValues={
                        {
                            name: '',
                            email: '',
                            password: '',
                            cpassword: ''
                        } as RegisterInfo
                    }
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Stack>
                                <InputField name="name" label="Name" />
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
                                <InputField
                                    name="cpassword"
                                    label="Confirm Password"
                                    type="password"
                                />

                                <LoadingButton
                                    type="submit"
                                    loading={isSubmitting}
                                    variant="contained"
                                    size="large"
                                    sx={{ marginTop: '15px' }}
                                >
                                    Register
                                </LoadingButton>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Stack>
        </Container>
    );
};

export default Register;
