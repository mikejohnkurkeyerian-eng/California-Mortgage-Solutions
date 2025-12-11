'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastProps } from '@/components/ui/Toast';

interface ToastContextType {
    setToast: (props: Omit<ToastProps, 'onClose'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToastState] = useState<Omit<ToastProps, 'onClose'> | null>(null);

    const setToast = (props: Omit<ToastProps, 'onClose'>) => {
        setToastState(props);
    };

    const handleClose = () => {
        setToastState(null);
    };

    return (
        <ToastContext.Provider value={{ setToast }}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={handleClose}
                />
            )}
        </ToastContext.Provider>
    );
};
