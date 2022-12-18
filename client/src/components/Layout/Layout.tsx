import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import { Toaster } from 'react-hot-toast';
import { useStore } from '../../store';
import Loading from '../Loading/Loading';

interface Props {
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const setAccessToken = useStore(state => state.setAccessToken);

    useEffect(() => {
        fetch('http://localhost:4000/auth/refresh_token', {
            method: 'POST',
            credentials: 'include'
        }).then(async res => {
            const { accessToken } = await res.json();
            setAccessToken(accessToken);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Header />
            {children}
            <Toaster />
        </>
    );
};

export default Layout;
