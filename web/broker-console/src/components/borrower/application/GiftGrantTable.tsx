import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Full1003Data } from '@/types/form-1003';

interface GiftGrantTableProps {
    data: NonNullable<Full1003Data['giftsOrGrants']>;
    onChange: (data: Full1003Data['giftsOrGrants']) => void;
    onBlur?: () => void;
}

export function GiftGrantTable({ data, onChange, onBlur }: GiftGrantTableProps) {
    const handleAdd = () => {
        onChange([
            ...data,
            {
                type: 'Cash',
                source: 'Relative',
                amount: 0
            }
        ]);
    };

    const handleRemove = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        onChange(newData);
    };

    const updateItem = (index: number, field: keyof typeof data[0], value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        onChange(newData);
    };

    return (
        <div className="space-y-4">
            {data.map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 relative animate-fade-in">
                    <button
                        onClick={() => handleRemove(index)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pr-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Type</label>
                            <select
                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={item.type}
                                onChange={(e) => updateItem(index, 'type', e.target.value)}
                                onBlur={onBlur}
                            >
                                <option value="Cash">Cash Gift</option>
                                <option value="Equity">Gift of Equity</option>
                                <option value="Other">Other Grant</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Source</label>
                            <select
                                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={item.source}
                                onChange={(e) => updateItem(index, 'source', e.target.value)}
                                onBlur={onBlur}
                            >
                                <option value="Relative">Relative</option>
                                <option value="Employer">Employer</option>
                                <option value="Agency">Agency</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <Input
                                label="Amount"
                                type="number"
                                prefix="$"
                                value={item.amount || ''}
                                onChange={(e) => updateItem(index, 'amount', parseFloat(e.target.value))}
                                onBlur={onBlur}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {data.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">No gifts or grants added yet.</p>
                    <Button onClick={handleAdd} variant="outline">
                        Add Gift/Grant
                    </Button>
                </div>
            )}

            {data.length > 0 && (
                <Button onClick={handleAdd} variant="outline" size="sm" className="mt-2">
                    + Add Another Gift/Grant
                </Button>
            )}
        </div>
    );
}
