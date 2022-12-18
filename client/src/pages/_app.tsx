// fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import type { AppProps } from 'next/app';
import { Layout } from '../components';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';
import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    createHttpLink,
    InMemoryCache
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useStore } from '../store';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

export default function App({ Component, pageProps }: AppProps) {
    const accessToken = useStore(state => state.accessToken);
    const setAccessToken = useStore(state => state.setAccessToken);

    const httpLink = createHttpLink({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include'
    });

    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: accessToken ? `Bearer ${accessToken}` : ''
            }
        };
    });

    const tokenRefreshLink = new TokenRefreshLink({
        accessTokenField: 'accessToken',
        isTokenValidOrUndefined: () => {
            if (!accessToken) {
                return true;
            }

            try {
                const { exp } = jwtDecode(accessToken) as { exp: number };

                if (Date.now() > exp * 1000) {
                    return false;
                } else {
                    return true;
                }
            } catch (error) {
                return false;
            }
        },
        fetchAccessToken: () => {
            return fetch('http://localhost:4000/auth/refresh_token', {
                method: 'POST',
                credentials: 'include'
            });
        },
        handleFetch: (accessToken: string) => {
            setAccessToken(accessToken);
        },
        handleError: (err: Error) => {
            console.error(err);
        }
    });

    const apolloClient = new ApolloClient({
        link: ApolloLink.from([tokenRefreshLink, authLink, httpLink]),
        cache: new InMemoryCache()
    });

    return (
        <>
            <ApolloProvider client={apolloClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
            </ApolloProvider>
        </>
    );
}
