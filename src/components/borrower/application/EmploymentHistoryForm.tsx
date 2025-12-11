import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Employment } from '@/types/form-1003';
import { Trash2, Plus } from 'lucide-react';

import { FormInsight } from '@/lib/form-intelligence';

interface EmploymentHistoryFormProps {
    data: Employment[];
    onChange: (data: Employment[]) => void;
    insights?: FormInsight[];
    onInsightAction?: (action: any) => void;
    onBlur?: () => void;
    highlightedFields?: Set<string>;
    onFieldFocus?: (field: string) => void;
    aiSuggestions?: Record<string, any>;
    onAcceptAiSuggestion?: (field: string, value: any) => void;
}

export const EmploymentHistoryForm: React.FC<EmploymentHistoryFormProps> = ({
    data,
    onChange,
    insights = [],
    onInsightAction,
    onBlur,
    highlightedFields,
    onFieldFocus,
    aiSuggestions,
    onAcceptAiSuggestion
}) => {
    const addEmployment = () => {
        const newEmployment: Employment = {
            employerName: '',
            isSelfEmployed: false,
            yearsOnJob: 0,
            monthsOnJob: 0,
            position: '',
            monthlyIncome: {
                base: 0,
                total: 0
            },
            employedByFamilyMember: false,
            employedByPartyToTransaction: false,
            ownershipShare: 0
        };
        onChange([...data, newEmployment]);
    };

    const removeEmployment = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        onChange(newData);
    };

    const updateEmployment = (index: number, field: keyof Employment, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        onChange(newData);
    };

    const updateIncome = (index: number, field: keyof Employment['monthlyIncome'], value: number) => {
        const newData = [...data];
        const currentIncome = newData[index].monthlyIncome;
        const newIncome = { ...currentIncome, [field]: value };

        // Recalculate total
        newIncome.total = (newIncome.base || 0) + (newIncome.overtime || 0) + (newIncome.bonus || 0) + (newIncome.commission || 0) + (newIncome.military || 0) + (newIncome.other || 0);

        newData[index] = { ...newData[index], monthlyIncome: newIncome };
        onChange(newData);
    };

    const employmentInsights = insights.filter(i => i.field === 'employment');

    return (
        <div className="space-y-6">
            {employmentInsights.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 w-full">
                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                Application Advisor
                            </h3>
                            <div className="mt-2 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                                {employmentInsights.map((insight, idx) => (
                                    <div key={idx} className="flex items-start justify-between">
                                        <p>{insight.message}</p>
                                        {insight.action && onInsightAction && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-4 h-6 text-xs border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/40"
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
            {data.map((item, index) => (
                <div key={index} className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-sm relative transition-all duration-200 hover:shadow-md">
                    <div className="absolute top-6 right-6">
                        <Button variant="ghost" size="sm" onClick={() => removeEmployment(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <h4 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white flex items-center">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                            {index + 1}
                        </span>
                        Employment Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Employer Name"
                            value={item.employerName}
                            onChange={(e) => updateEmployment(index, 'employerName', e.target.value)}
                            onBlur={onBlur}
                            highlighted={highlightedFields?.has(`employment[${index}].employerName`)}
                            onFocus={() => onFieldFocus?.(`employment[${index}].employerName`)}
                            aiSuggestion={aiSuggestions?.[`employment[${index}].employerName`]}
                            onAcceptAiSuggestion={(val) => onAcceptAiSuggestion?.(`employment[${index}].employerName`, val)}
                        />
                        <div className="space-y-3 pt-1">
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white">Employment Type</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={item.isSelfEmployed}
                                        onChange={(e) => updateEmployment(index, 'isSelfEmployed', e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-colors"
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Self-Employed</span>
                                </label>
                            </div>
                            {item.isSelfEmployed && (
                                <div className="animate-fade-in">
                                    <Input
                                        label="Ownership Share (%)"
                                        type="number"
                                        value={item.ownershipShare || ''}
                                        onChange={(e) => updateEmployment(index, 'ownershipShare', Number(e.target.value))}
                                        className="w-full"
                                        onBlur={onBlur}
                                    />
                                </div>
                            )}
                        </div>

                        <Input
                            label="Position / Title"
                            value={item.position}
                            onChange={(e) => updateEmployment(index, 'position', e.target.value)}
                            onBlur={onBlur}
                            highlighted={highlightedFields?.has(`employment[${index}].position`)}
                            onFocus={() => onFieldFocus?.(`employment[${index}].position`)}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Years on Job"
                                type="number"
                                value={item.yearsOnJob === 0 ? '' : item.yearsOnJob}
                                onChange={(e) => updateEmployment(index, 'yearsOnJob', Number(e.target.value))}
                                onBlur={onBlur}
                            />
                            <Input
                                label="Months on Job"
                                type="number"
                                value={item.monthsOnJob === 0 ? '' : item.monthsOnJob}
                                onChange={(e) => updateEmployment(index, 'monthsOnJob', Number(e.target.value))}
                                onBlur={onBlur}
                            />
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={item.employedByFamilyMember}
                                    onChange={(e) => updateEmployment(index, 'employedByFamilyMember', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Employed by a family member?</span>
                            </label>
                            <label className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={item.employedByPartyToTransaction}
                                    onChange={(e) => updateEmployment(index, 'employedByPartyToTransaction', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Employed by party to transaction?</span>
                            </label>
                        </div>

                        <div className="md:col-span-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <h5 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Monthly Income Details</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <Input
                                    label="Base Salary"
                                    type="number"
                                    value={item.monthlyIncome.base || ''}
                                    onChange={(e) => updateIncome(index, 'base', Number(e.target.value))}
                                    onBlur={onBlur}
                                    highlighted={highlightedFields?.has(`employment[${index}].monthlyIncome.base`)}
                                    onFocus={() => onFieldFocus?.(`employment[${index}].monthlyIncome.base`)}
                                    aiSuggestion={aiSuggestions?.[`employment[${index}].monthlyIncome.base`]}
                                    onAcceptAiSuggestion={(val) => onAcceptAiSuggestion?.(`employment[${index}].monthlyIncome.base`, val)}
                                />
                                <Input
                                    label="Overtime"
                                    type="number"
                                    value={item.monthlyIncome.overtime || ''}
                                    onChange={(e) => updateIncome(index, 'overtime', Number(e.target.value))}
                                    onBlur={onBlur}
                                />
                                <Input
                                    label="Bonus"
                                    type="number"
                                    value={item.monthlyIncome.bonus || ''}
                                    onChange={(e) => updateIncome(index, 'bonus', Number(e.target.value))}
                                    onBlur={onBlur}
                                />
                                <Input
                                    label="Commission"
                                    type="number"
                                    value={item.monthlyIncome.commission || ''}
                                    onChange={(e) => updateIncome(index, 'commission', Number(e.target.value))}
                                    onBlur={onBlur}
                                />
                                <Input
                                    label="Military"
                                    type="number"
                                    value={item.monthlyIncome.military || ''}
                                    onChange={(e) => updateIncome(index, 'military', Number(e.target.value))}
                                    onBlur={onBlur}
                                />
                                <Input
                                    label="Other"
                                    type="number"
                                    value={item.monthlyIncome.other || ''}
                                    onChange={(e) => updateIncome(index, 'other', Number(e.target.value))}
                                    onBlur={onBlur}
                                />
                            </div>
                            <div className="mt-6 flex justify-end items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-3">Total Monthly Income: </span>
                                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                    ${item.monthlyIncome.total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Button type="button" variant="outline" onClick={addEmployment} className="w-full border-dashed py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <Plus className="w-4 h-4 mr-2" /> Add Employment
            </Button>
        </div>
    );
};
