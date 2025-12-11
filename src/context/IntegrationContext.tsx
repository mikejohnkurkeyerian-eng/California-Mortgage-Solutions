'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrokerCredential, IntegrationContextType } from '@/types/integration';

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

export function IntegrationProvider({ children }: { children: React.ReactNode }) {
    const [credentials, setCredentials] = useState<BrokerCredential[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('broker_framework_credentials');
        if (saved) {
            try {
                setCredentials(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load credentials', e);
            }
        }
    }, []);

    const saveCredential = (cred: BrokerCredential) => {
        setCredentials(prev => {
            const others = prev.filter(c => c.lenderId !== cred.lenderId);
            const newState = [...others, cred];
            localStorage.setItem('broker_framework_credentials', JSON.stringify(newState));
            return newState;
        });
    };

    const getCredential = (lenderId: string) => {
        return credentials.find(c => c.lenderId === lenderId);
    };

    const deleteCredential = (lenderId: string) => {
        setCredentials(prev => {
            const newState = prev.filter(c => c.lenderId !== lenderId);
            localStorage.setItem('broker_framework_credentials', JSON.stringify(newState));
            return newState;
        });
    };

    return (
        <IntegrationContext.Provider value={{
            credentials,
            saveCredential,
            getCredential,
            deleteCredential
        }}>
            {children}
        </IntegrationContext.Provider>
    );
}

export function useIntegration() {
    const context = useContext(IntegrationContext);
    if (context === undefined) {
        throw new Error('useIntegration must be used within an IntegrationProvider');
    }
    return context;
}

