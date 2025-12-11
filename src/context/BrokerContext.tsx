'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Lender {
    id: string;
    name: string;
    provider: 'UWM' | 'Rocket' | 'PennyMac' | 'Other';
    credentials: {
        type: 'api_key' | 'login';
        apiKey?: string;
        username?: string;
        password?: string;
    };
}

export interface Underwriter {
    id: string;
    name: string;
    email: string;
    type: 'internal' | 'external';
    company?: string;
}

export interface EmailSettings {
    provider: 'gmail' | 'sendgrid' | 'resend' | 'custom_smtp';
    fromEmail: string;
    fromName: string;
    // For Gmail/SMTP
    smtpUser?: string;
    smtpPass?: string; // App Password for Gmail
    smtpHost?: string;
    smtpPort?: number;
    // For API Providers
    apiKey?: string;
}

export interface CreditIntegration {
    provider: 'cic' | 'advantage' | 'credco' | 'mock' | 'none';
    username?: string;
    password?: string;
    accountId?: string;
    enabled: boolean;
}

export interface BrokerSettings {
    useFannieMae: boolean;
    useFreddieMac: boolean;
    defaultUnderwritingMode: 'EMAIL' | 'IN_HOUSE' | 'LENDER';
    underwriters: Underwriter[];
    lenders: Lender[];
    emailSettings?: EmailSettings;
    creditIntegration: CreditIntegration;
    theme: 'light' | 'dark';
}

interface BrokerContextType {
    settings: BrokerSettings;
    updateSettings: (newSettings: Partial<BrokerSettings>) => void;
    addUnderwriter: (underwriter: Omit<Underwriter, 'id'>) => void;
    removeUnderwriter: (id: string) => void;
    addLender: (lender: Omit<Lender, 'id'>) => void;
    removeLender: (id: string) => void;
    updateEmailSettings: (settings: EmailSettings) => void;
    resetSettings: () => void;
    toggleTheme: () => void;
}

const defaultSettings: BrokerSettings = {
    useFannieMae: true,
    useFreddieMac: false,
    defaultUnderwritingMode: 'EMAIL',
    underwriters: [
        {
            id: 'default-mike',
            name: 'mike',
            email: 'mikejohnkurkeyerian@gmail.com',
            type: 'internal'
        }
    ],
    lenders: [],
    emailSettings: {
        provider: 'gmail',
        fromEmail: 'Mikekurkeyerian09@gmail.com',
        fromName: 'mikes bot',
        smtpUser: 'Mikekurkeyerian09@gmail.com',
        smtpPass: 'wbwg mbul ngel zslq'
    },
    creditIntegration: {
        provider: 'none',
        enabled: false
    },
    theme: 'dark' // Default to dark for premium feel
};

const BrokerContext = createContext<BrokerContextType | undefined>(undefined);

export const useBrokerSettings = () => {
    const context = useContext(BrokerContext);
    if (!context) {
        throw new Error('useBrokerSettings must be used within a BrokerProvider');
    }
    return context;
};

export const BrokerProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<BrokerSettings>(defaultSettings);

    // Load settings from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('broker_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure theme exists in parsed settings (migration)
                if (!parsed.theme) parsed.theme = 'dark';
                setSettings(parsed);
            } catch (e) {
                console.error('Failed to parse broker settings', e);
            }
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings.theme]);

    const updateSettings = (newSettings: Partial<BrokerSettings>) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('broker_settings', JSON.stringify(updated));
            return updated;
        });
    };

    const toggleTheme = () => {
        updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem('broker_settings');
    };

    const addUnderwriter = (underwriter: Omit<Underwriter, 'id'>) => {
        const newUnderwriter: Underwriter = {
            ...underwriter,
            id: Math.random().toString(36).substr(2, 9)
        };
        updateSettings({
            underwriters: [...settings.underwriters, newUnderwriter]
        });
    };

    const removeUnderwriter = (id: string) => {
        updateSettings({
            underwriters: settings.underwriters.filter(u => u.id !== id)
        });
    };

    const addLender = (lender: Omit<Lender, 'id'>) => {
        const newLender: Lender = {
            ...lender,
            id: Math.random().toString(36).substr(2, 9)
        };
        updateSettings({
            lenders: [...(settings.lenders || []), newLender]
        });
    };

    const removeLender = (id: string) => {
        updateSettings({
            lenders: (settings.lenders || []).filter(l => l.id !== id)
        });
    };

    const updateEmailSettings = (emailSettings: EmailSettings) => {
        updateSettings({ emailSettings });
    };

    return (
        <BrokerContext.Provider value={{ settings, updateSettings, addUnderwriter, removeUnderwriter, addLender, removeLender, updateEmailSettings, resetSettings, toggleTheme }}>
            {children}
        </BrokerContext.Provider>
    );
};

