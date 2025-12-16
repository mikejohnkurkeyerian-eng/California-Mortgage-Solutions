'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    label?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder = "Select...", label }: MultiSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleOption = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter(item => item !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    const handleRemove = (value: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleOption(value);
    };

    return (
        <div className="w-full space-y-1" ref={dropdownRef}>
            {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}

            <div className="relative">
                <div
                    className="min-h-[42px] px-3 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer flex flex-wrap gap-2 items-center hover:border-white/20 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selected.length === 0 && (
                        <span className="text-slate-500 text-sm">{placeholder}</span>
                    )}

                    {selected.map(value => {
                        const option = options.find(o => o.value === value);
                        return (
                            <span key={value} className="bg-primary-500/20 text-primary-200 border border-primary-500/30 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                {option?.label || value}
                                <span
                                    className="cursor-pointer hover:text-white"
                                    onClick={(e) => handleRemove(value, e)}
                                >
                                    ×
                                </span>
                            </span>
                        );
                    })}

                    <div className="ml-auto text-slate-400">
                        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`px-3 py-2 cursor-pointer flex items-center gap-2 hover:bg-white/5 transition-colors ${selected.includes(option.value) ? 'bg-primary-500/10 text-primary-200' : 'text-slate-300'}`}
                                onClick={() => toggleOption(option.value)}
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected.includes(option.value) ? 'bg-primary-500 border-primary-500' : 'border-slate-500'}`}>
                                    {selected.includes(option.value) && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm">{option.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
