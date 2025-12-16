'use client';

import { BrokerProvider } from '@/context/BrokerContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { IntegrationProvider } from '@/context/IntegrationContext';

export default function BrokerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <BrokerProvider>
                <IntegrationProvider>
                    {children}
                </IntegrationProvider>
            </BrokerProvider>
        </QueryClientProvider>
    );
}

