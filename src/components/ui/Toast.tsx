'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration]); // Exclude onClose to prevent infinite loop if parent passes unstable function reference

    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    }[type];

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 z-50 ${bgColor} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
        >
            {message}
        </div>,
        document.body
    );
}

