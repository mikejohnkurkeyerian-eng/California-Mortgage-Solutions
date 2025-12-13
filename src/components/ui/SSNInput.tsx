import React, { useRef, useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SSNInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
    highlighted?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
}

export const SSNInput = ({ value = '', onChange, error, label, highlighted, onFocus, onBlur }: SSNInputProps) => {
    // Ensure value is a string and max 9 chars
    const cleanValue = (value || '').replace(/\D/g, '').slice(0, 9);

    // We maintain internal inputs state for smooth typing, sync with prop value
    const [inputs, setInputs] = useState<string[]>(Array(9).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Sync external value to internal inputs
    useEffect(() => {
        const newInputs = Array(9).fill('');
        for (let i = 0; i < 9; i++) {
            newInputs[i] = cleanValue[i] || '';
        }
        setInputs(newInputs);
    }, [cleanValue]);

    const handleChange = (index: number, val: string) => {
        // Only allow numbers
        const lastChar = val.slice(-1).replace(/\D/g, '');
        if (!lastChar && val) return; // Ignore if non-number was typed and length > 0

        const newInputs = [...inputs];
        newInputs[index] = lastChar;
        setInputs(newInputs);

        // Construct new full value
        const newValue = newInputs.join('');
        onChange(newValue);

        // Auto-advance
        if (lastChar && index < 8) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!inputs[index] && index > 0) {
                // If empty and backspace, move previous and delete
                const newInputs = [...inputs];
                newInputs[index - 1] = '';
                setInputs(newInputs);
                onChange(newInputs.join(''));
                inputRefs.current[index - 1]?.focus();
            } else {
                // Just delete current (handled by onChange usually, but explicit here for safety)
                const newInputs = [...inputs];
                newInputs[index] = '';
                setInputs(newInputs);
                onChange(newInputs.join(''));
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 8) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 9);
        onChange(pastedData);
        // Focus the input after the last pasted character
        const nextIndex = Math.min(pastedData.length, 8);
        inputRefs.current[nextIndex]?.focus();
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                    {label}
                </label>
            )}
            <div
                className={twMerge(
                    "flex gap-x-2 items-center",
                    highlighted && "ring-2 ring-amber-500 rounded-lg p-1"
                )}
                onFocus={onFocus}
                onBlur={onBlur}
            >
                {/* Group 1: 3 digits */}
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <input
                            key={i}
                            ref={(el) => (inputRefs.current[i] = el) as any}
                            type="password"
                            inputMode="numeric"
                            value={inputs[i]}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            className={clsx(
                                "w-9 h-10 text-center text-lg font-bold bg-slate-50 dark:bg-surface-highlight/30 border rounded transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                                error ? "border-red-500" : "border-slate-200 dark:border-white/10",
                                inputs[i] ? "text-slate-900 dark:text-white" : "text-transparent"
                            )}
                            maxLength={1}
                            autoComplete="off"
                        />
                    ))}
                </div>

                <span className="text-slate-400 font-bold">-</span>

                {/* Group 2: 2 digits */}
                <div className="flex gap-1">
                    {[3, 4].map((i) => (
                        <input
                            key={i}
                            ref={(el) => (inputRefs.current[i] = el) as any}
                            type="password"
                            inputMode="numeric"
                            value={inputs[i]}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            className={clsx(
                                "w-9 h-10 text-center text-lg font-bold bg-slate-50 dark:bg-surface-highlight/30 border rounded transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                                error ? "border-red-500" : "border-slate-200 dark:border-white/10",
                                inputs[i] ? "text-slate-900 dark:text-white" : "text-transparent"
                            )}
                            maxLength={1}
                            autoComplete="off"
                        />
                    ))}
                </div>

                <span className="text-slate-400 font-bold">-</span>

                {/* Group 3: 4 digits */}
                <div className="flex gap-1">
                    {[5, 6, 7, 8].map((i) => (
                        <input
                            key={i}
                            ref={(el) => (inputRefs.current[i] = el) as any}
                            type="password"
                            inputMode="numeric"
                            value={inputs[i]}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            className={clsx(
                                "w-9 h-10 text-center text-lg font-bold bg-slate-50 dark:bg-surface-highlight/30 border rounded transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                                error ? "border-red-500" : "border-slate-200 dark:border-white/10",
                                inputs[i] ? "text-slate-900 dark:text-white" : "text-transparent"
                            )}
                            maxLength={1}
                            autoComplete="off"
                        />
                    ))}
                </div>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
};
