import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    highlighted?: boolean;
    aiSuggestion?: string | number;
    onAcceptAiSuggestion?: (value: any) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, highlighted, aiSuggestion, onAcceptAiSuggestion, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1.5 shadow-sm">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        'w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200',
                        error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
                        highlighted && 'ring-2 ring-amber-500 border-amber-500 animate-pulse',
                        className
                    )}
                    {...props}
                />
                {aiSuggestion !== undefined && (
                    <div className="mt-1.5 flex items-center gap-2 animate-fade-in">
                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1">
                            <span>✨</span> AI Suggests: <span className="font-bold">{aiSuggestion}</span>
                        </span>
                        {onAcceptAiSuggestion && (
                            <button
                                type="button"
                                onClick={() => onAcceptAiSuggestion(aiSuggestion)}
                                className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                            >
                                Apply
                            </button>
                        )}
                    </div>
                )}
                {error && (
                    <p className="mt-1 text-sm text-red-400">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
