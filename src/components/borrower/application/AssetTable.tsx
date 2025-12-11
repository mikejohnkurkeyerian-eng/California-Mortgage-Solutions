import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Asset } from '@/types/form-1003';
import { Trash2, Plus } from 'lucide-react';
import { FormInsight } from '@/lib/form-intelligence';

interface AssetTableProps {
    data: Asset[];
    onChange: (data: Asset[]) => void;
    insights?: FormInsight[];
    onInsightAction?: (action: any) => void;
    onBlur?: () => void;
    highlightedFields?: Set<string>;
    onFieldFocus?: (field: string) => void;
    aiSuggestions?: Record<string, any>;
    onAcceptAiSuggestion?: (field: string, value: any) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
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
    const addAsset = () => {
        const newAsset: Asset = {
            type: 'Checking',
            institutionName: '',
            accountNumber: '',
            cashOrMarketValue: 0
        };
        onChange([...data, newAsset]);
    };

    const removeAsset = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        onChange(newData);
    };

    const updateAsset = (index: number, field: keyof Asset, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        onChange(newData);
    };

    const totalAssets = data.reduce((sum, item) => sum + (item.cashOrMarketValue || 0), 0);

    const assetInsights = insights.filter(i => i.field === 'assets');

    return (
        <div className="space-y-6">
            {assetInsights.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 w-full">
                            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                Asset Analysis
                            </h3>
                            <div className="mt-2 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                                {assetInsights.map((insight, idx) => (
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

            <div className="grid grid-cols-1 gap-6">
                {data.map((item, index) => (
                    <div key={index} className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-sm relative transition-all duration-200 hover:shadow-md">
                        <div className="absolute top-6 right-6">
                            <Button variant="ghost" size="sm" onClick={() => removeAsset(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <h4 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white flex items-center">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                                {index + 1}
                            </span>
                            Asset Details
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1.5">Account Type</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-surface-highlight/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
                                    value={item.type}
                                    onChange={(e) => updateAsset(index, 'type', e.target.value)}
                                >
                                    <option value="Checking">Checking</option>
                                    <option value="Savings">Savings</option>
                                    <option value="MoneyMarket">Money Market</option>
                                    <option value="CertificateOfDeposit">CD</option>
                                    <option value="MutualFund">Mutual Fund</option>
                                    <option value="Stocks">Stocks</option>
                                    <option value="Retirement">Retirement (401k, IRA)</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <Input
                                label="Financial Institution"
                                value={item.institutionName}
                                onChange={(e) => updateAsset(index, 'institutionName', e.target.value)}
                                onBlur={onBlur}
                                highlighted={highlightedFields?.has(`assets[${index}].institutionName`)}
                                onFocus={() => onFieldFocus?.(`assets[${index}].institutionName`)}
                            />
                            <Input
                                label="Account # (Last 4)"
                                value={item.accountNumber}
                                onChange={(e) => updateAsset(index, 'accountNumber', e.target.value)}
                                onBlur={onBlur}
                                highlighted={highlightedFields?.has(`assets[${index}].accountNumber`)}
                                onFocus={() => onFieldFocus?.(`assets[${index}].accountNumber`)}
                            />
                            <Input
                                label="Cash / Market Value"
                                type="number"
                                value={item.cashOrMarketValue || ''}
                                onChange={(e) => updateAsset(index, 'cashOrMarketValue', Number(e.target.value))}
                                onBlur={onBlur}
                                highlighted={highlightedFields?.has(`assets[${index}].cashOrMarketValue`)}
                                onFocus={() => onFieldFocus?.(`assets[${index}].cashOrMarketValue`)}
                                aiSuggestion={aiSuggestions?.[`assets[${index}].cashOrMarketValue`]}
                                onAcceptAiSuggestion={(val) => onAcceptAiSuggestion?.(`assets[${index}].cashOrMarketValue`, val)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {data.length === 0 && (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">No assets listed yet.</p>
                </div>
            )}

            <div className="flex justify-end items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-3">Total Assets:</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">${totalAssets.toLocaleString()}</span>
            </div>

            <Button type="button" variant="outline" onClick={addAsset} className="w-full border-dashed py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <Plus className="w-4 h-4 mr-2" /> Add Asset
            </Button>
        </div>
    );
};

