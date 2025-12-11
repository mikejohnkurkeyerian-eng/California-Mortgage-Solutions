import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Liability } from '@/types/form-1003';
import { Trash2, Plus } from 'lucide-react';

import { FormInsight } from '@/lib/form-intelligence';

interface LiabilityTableProps {
    data: Liability[];
    onChange: (data: Liability[]) => void;
    insights?: FormInsight[];
    onInsightAction?: (action: any) => void;
    onBlur?: () => void;
    highlightedFields?: Set<string>;
    onFieldFocus?: (field: string) => void;
}

export const LiabilityTable: React.FC<LiabilityTableProps> = ({ data, onChange, insights = [], onInsightAction, onBlur, highlightedFields, onFieldFocus }) => {
    const addLiability = () => {
        const newLiability: Liability = {
            type: 'Revolving',
            companyName: '',
            accountNumber: '',
            unpaidBalance: 0,
            monthlyPayment: 0,
            toBePaidOff: false,
            resubordinated: false,
            omitted: false
        };
        onChange([...data, newLiability]);
    };

    const removeLiability = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        onChange(newData);
    };

    const updateLiability = (index: number, field: keyof Liability, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        onChange(newData);
    };

    const totalBalance = data.reduce((sum, item) => sum + (item.unpaidBalance || 0), 0);
    const totalPayment = data.reduce((sum, item) => sum + (item.monthlyPayment || 0), 0);

    const liabilityInsights = insights.filter(i => i.field === 'liabilities');

    return (
        <div className="space-y-6">
            {liabilityInsights.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 w-full">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                Debt Analysis
                            </h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-2">
                                {liabilityInsights.map((insight, idx) => (
                                    <div key={idx} className="flex items-start justify-between">
                                        <p>{insight.message}</p>
                                        {insight.action && onInsightAction && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-4 h-6 text-xs border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/40"
                                                onClick={() => onInsightAction(insight.action)}
                                            >
                                                Fix This
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {data.map((item, index) => (
                    <div key={index} className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-sm relative transition-all duration-200 hover:shadow-md">
                        <div className="absolute top-6 right-6">
                            <Button variant="ghost" size="sm" onClick={() => removeLiability(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <h4 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white flex items-center">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                                {index + 1}
                            </span>
                            Liability Details
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1.5">Type</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                                    value={item.type}
                                    onChange={(e) => updateLiability(index, 'type', e.target.value)}
                                >
                                    <option value="Revolving">Revolving (Credit Cards)</option>
                                    <option value="Installment">Installment (Loans)</option>
                                    <option value="Lease">Lease</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <Input
                                label="Creditor Name"
                                value={item.companyName}
                                onChange={(e) => updateLiability(index, 'companyName', e.target.value)}
                                onBlur={onBlur}
                                highlighted={highlightedFields?.has(`liabilities[${index}].companyName`)}
                                onFocus={() => onFieldFocus?.(`liabilities[${index}].companyName`)}
                            />
                            <Input
                                label="Account #"
                                value={item.accountNumber}
                                onChange={(e) => updateLiability(index, 'accountNumber', e.target.value)}
                                onBlur={onBlur}
                                highlighted={highlightedFields?.has(`liabilities[${index}].accountNumber`)}
                                onFocus={() => onFieldFocus?.(`liabilities[${index}].accountNumber`)}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Unpaid Balance"
                                    type="number"
                                    value={item.unpaidBalance || ''}
                                    onChange={(e) => updateLiability(index, 'unpaidBalance', Number(e.target.value))}
                                    onBlur={onBlur}
                                    highlighted={highlightedFields?.has(`liabilities[${index}].unpaidBalance`)}
                                    onFocus={() => onFieldFocus?.(`liabilities[${index}].unpaidBalance`)}
                                />
                                <Input
                                    label="Monthly Payment"
                                    type="number"
                                    value={item.monthlyPayment || ''}
                                    onChange={(e) => updateLiability(index, 'monthlyPayment', Number(e.target.value))}
                                    onBlur={onBlur}
                                    highlighted={highlightedFields?.has(`liabilities[${index}].monthlyPayment`)}
                                    onFocus={() => onFieldFocus?.(`liabilities[${index}].monthlyPayment`)}
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={item.toBePaidOff}
                                    onChange={(e) => updateLiability(index, 'toBePaidOff', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">To be paid off?</span>
                            </label>
                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={item.resubordinated}
                                    onChange={(e) => updateLiability(index, 'resubordinated', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Resubordinated?</span>
                            </label>
                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={item.omitted}
                                    onChange={(e) => updateLiability(index, 'omitted', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Omitted?</span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {data.length === 0 && (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">No liabilities listed yet.</p>
                </div>
            )}

            <div className="flex justify-end items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 space-x-6">
                <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">Total Balance:</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">${totalBalance.toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2">Total Payment:</span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">${totalPayment.toLocaleString()}</span>
                </div>
            </div>

            <Button type="button" variant="outline" onClick={addLiability} className="w-full border-dashed py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <Plus className="w-4 h-4 mr-2" /> Add Liability
            </Button>
        </div>
    );
};

