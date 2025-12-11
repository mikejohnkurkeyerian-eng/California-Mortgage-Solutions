import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RealEstate } from '@/types/form-1003';
import { Trash2, Plus } from 'lucide-react';

import { FormInsight } from '@/lib/form-intelligence';

interface RealEstateTableProps {
    data: RealEstate[];
    onChange: (data: RealEstate[]) => void;
    insights?: FormInsight[];
    onInsightAction?: (action: any) => void;
    onBlur?: () => void;
    highlightedFields?: Set<string>;
    onFieldFocus?: (field: string) => void;
}

export const RealEstateTable: React.FC<RealEstateTableProps> = ({ data, onChange, insights = [], onInsightAction, onBlur, highlightedFields, onFieldFocus }) => {
    const addProperty = () => {
        const newProperty: RealEstate = {
            address: { street: '', city: '', state: '', zip: '' },
            propertyValue: 0,
            status: 'Retained',
            intendedOccupancy: 'Investment',
            mortgageLoans: []
        };
        onChange([...data, newProperty]);
    };

    const removeProperty = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        onChange(newData);
    };

    const updateProperty = (index: number, field: keyof RealEstate, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        onChange(newData);
    };

    const updateAddress = (index: number, field: keyof RealEstate['address'], value: any) => {
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            address: { ...newData[index].address, [field]: value }
        };
        onChange(newData);
    };

    const addMortgage = (propertyIndex: number) => {
        const newData = [...data];
        newData[propertyIndex].mortgageLoans.push({
            creditorName: '',
            accountNumber: '',
            monthlyPayment: 0,
            unpaidBalance: 0,
            type: 'Conventional'
        });
        onChange(newData);
    };

    const removeMortgage = (propertyIndex: number, mortgageIndex: number) => {
        const newData = [...data];
        newData[propertyIndex].mortgageLoans.splice(mortgageIndex, 1);
        onChange(newData);
    };

    const updateMortgage = (propertyIndex: number, mortgageIndex: number, field: string, value: any) => {
        const newData = [...data];
        newData[propertyIndex].mortgageLoans[mortgageIndex] = {
            ...newData[propertyIndex].mortgageLoans[mortgageIndex],
            [field]: value
        };
        onChange(newData);
    };

    const realEstateInsights = insights.filter(i => i.field === 'realEstate');

    return (
        <div className="space-y-6">
            {realEstateInsights.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 w-full">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Real Estate Analysis
                            </h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-2">
                                {realEstateInsights.map((insight, idx) => (
                                    <div key={idx} className="flex items-start justify-between">
                                        <p>{insight.message}</p>
                                        {insight.action && onInsightAction && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-4 h-6 text-xs border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/40"
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
                            <Button variant="ghost" size="sm" onClick={() => removeProperty(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <h4 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white flex items-center">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">
                                {index + 1}
                            </span>
                            Property Details
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="md:col-span-2">
                                <Input
                                    label="Street Address"
                                    value={item.address.street}
                                    onChange={(e) => updateAddress(index, 'street', e.target.value)}
                                    onBlur={onBlur}
                                    highlighted={highlightedFields?.has(`realEstate[${index}].address.street`)}
                                    onFocus={() => onFieldFocus?.(`realEstate[${index}].address.street`)}
                                />
                            </div>
                            <Input
                                label="City"
                                value={item.address.city}
                                onChange={(e) => updateAddress(index, 'city', e.target.value)}
                                onBlur={onBlur}
                                highlighted={highlightedFields?.has(`realEstate[${index}].address.city`)}
                                onFocus={() => onFieldFocus?.(`realEstate[${index}].address.city`)}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="State"
                                    value={item.address.state}
                                    onChange={(e) => updateAddress(index, 'state', e.target.value)}
                                    onBlur={onBlur}
                                    highlighted={highlightedFields?.has(`realEstate[${index}].address.state`)}
                                    onFocus={() => onFieldFocus?.(`realEstate[${index}].address.state`)}
                                />
                                <Input
                                    label="Zip Code"
                                    value={item.address.zip}
                                    onChange={(e) => updateAddress(index, 'zip', e.target.value)}
                                    onBlur={onBlur}
                                    highlighted={highlightedFields?.has(`realEstate[${index}].address.zip`)}
                                    onFocus={() => onFieldFocus?.(`realEstate[${index}].address.zip`)}
                                />
                            </div>

                            <Input
                                label="Property Value"
                                type="number"
                                value={item.propertyValue || ''}
                                onChange={(e) => updateProperty(index, 'propertyValue', Number(e.target.value))}
                                onBlur={onBlur}
                                highlighted={highlightedFields?.has(`realEstate[${index}].propertyValue`)}
                                onFocus={() => onFieldFocus?.(`realEstate[${index}].propertyValue`)}
                            />

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Retained', 'Sold', 'Pending'].map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => updateProperty(index, 'status', status)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${item.status === status
                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Intended Occupancy</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Primary', 'Investment', 'SecondHome'].map((occ) => (
                                            <button
                                                key={occ}
                                                type="button"
                                                onClick={() => updateProperty(index, 'intendedOccupancy', occ)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${item.intendedOccupancy === occ
                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                {occ === 'SecondHome' ? 'Second Home' : occ}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Input
                                label="Monthly Insurance, Taxes, HOA"
                                type="number"
                                value={item.monthlyInsuranceTaxesHOA || ''}
                                onChange={(e) => updateProperty(index, 'monthlyInsuranceTaxesHOA', Number(e.target.value))}
                                onBlur={onBlur}
                            />

                            <Input
                                label="Monthly Rental Income"
                                type="number"
                                value={item.monthlyRentalIncome || ''}
                                onChange={(e) => updateProperty(index, 'monthlyRentalIncome', Number(e.target.value))}
                                onBlur={onBlur}
                            />
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="text-sm font-semibold text-slate-900 dark:text-white">Mortgage Loans on this Property</h5>
                                <Button type="button" variant="ghost" size="sm" onClick={() => addMortgage(index)} className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                                    + Add Mortgage
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {item.mortgageLoans.map((mortgage, mIndex) => (
                                    <div key={mIndex} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <div className="md:col-span-3">
                                            <Input
                                                placeholder="Creditor Name"
                                                value={mortgage.creditorName}
                                                onChange={(e) => updateMortgage(index, mIndex, 'creditorName', e.target.value)}
                                                className="h-9 text-sm"
                                                onBlur={onBlur}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <Input
                                                placeholder="Account #"
                                                value={mortgage.accountNumber}
                                                onChange={(e) => updateMortgage(index, mIndex, 'accountNumber', e.target.value)}
                                                className="h-9 text-sm"
                                                onBlur={onBlur}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Input
                                                type="number"
                                                placeholder="Balance"
                                                value={mortgage.unpaidBalance || ''}
                                                onChange={(e) => updateMortgage(index, mIndex, 'unpaidBalance', Number(e.target.value))}
                                                className="h-9 text-sm"
                                                onBlur={onBlur}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Input
                                                type="number"
                                                placeholder="Payment"
                                                value={mortgage.monthlyPayment || ''}
                                                onChange={(e) => updateMortgage(index, mIndex, 'monthlyPayment', Number(e.target.value))}
                                                className="h-9 text-sm"
                                                onBlur={onBlur}
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex items-center space-x-2">
                                            <select
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white h-9 focus:ring-2 focus:ring-primary-500/50 focus:outline-none"
                                                value={mortgage.type}
                                                onChange={(e) => updateMortgage(index, mIndex, 'type', e.target.value)}
                                            >
                                                <option value="Conventional">Conv</option>
                                                <option value="FHA">FHA</option>
                                                <option value="VA">VA</option>
                                                <option value="USDA">USDA</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <Button variant="ghost" size="sm" onClick={() => removeMortgage(index, mIndex)} className="text-red-500 h-9 w-9 p-0 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {item.mortgageLoans.length === 0 && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-2">No mortgages listed.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Button type="button" variant="outline" onClick={addProperty} className="w-full border-dashed py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <Plus className="w-4 h-4 mr-2" /> Add Property
            </Button>
        </div>
    );
};
