import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outline';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
    const variants = {
        default: 'bg-white dark:bg-surface border border-slate-200 dark:border-white/5 shadow-xl',
        glass: 'bg-white/80 dark:bg-surface/40 backdrop-blur-lg border border-slate-200 dark:border-white/10 shadow-xl',
        outline: 'bg-transparent border border-slate-200 dark:border-white/10',
    };

    return (
        <div
            className={twMerge(
                'rounded-xl overflow-hidden transition-colors duration-200',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={twMerge('px-6 py-4 border-b border-slate-100 dark:border-white/5', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={twMerge('text-lg font-heading font-bold text-slate-900 dark:text-white', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={twMerge('text-sm text-slate-500 dark:text-slate-400 mt-1', className)} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={twMerge('p-6', className)} {...props}>
            {children}
        </div>
    );
}
