'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../lib/redux/store';

interface Props {
    children: React.ReactNode;
    session?: any;
}

export default function SessionProviderWrapper({ children, session }: Props) {
    return (
        <ReduxProvider store={store}>
            <SessionProvider session={session}>{children}</SessionProvider>
        </ReduxProvider>
    );
}
