import React from 'react';
import { Input } from '@/components/ui/Input';
import { AddressHistory } from '@/types/form-1003';

interface AddressHistoryProps {
    data: AddressHistory;
    onChange: (data: AddressHistory) => void;
    onBlur?: () => void;
    title?: string;
    highlightedFields?: Set<string>;
    onFieldFocus?: (field: string) => void;
}

export const AddressHistoryForm: React.FC<AddressHistoryProps> = ({ data, onChange, onBlur, title = "Current Address", highlightedFields, onFieldFocus }) => {
    const handleChange = (field: keyof AddressHistory, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{title}</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Input
                        label="Street Address"
                        value={data.street}
                        onChange={(e) => handleChange('street', e.target.value)}
                        onBlur={onBlur}
                        highlighted={highlightedFields?.has('currentAddress.street')}
                        onFocus={() => onFieldFocus?.('currentAddress.street')}
                    />
                </div>
                <Input
                    label="City"
                    value={data.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onBlur={onBlur}
                    highlighted={highlightedFields?.has('currentAddress.city')}
                    onFocus={() => onFieldFocus?.('currentAddress.city')}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="State"
                        value={data.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        onBlur={onBlur}
                        highlighted={highlightedFields?.has('currentAddress.state')}
                        onFocus={() => onFieldFocus?.('currentAddress.state')}
                    />
                    <Input
                        label="Zip Code"
                        value={data.zip}
                        onChange={(e) => handleChange('zip', e.target.value)}
                        onBlur={onBlur}
                        highlighted={highlightedFields?.has('currentAddress.zip')}
                        onFocus={() => onFieldFocus?.('currentAddress.zip')}
                    />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Housing Status</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'Own', label: 'Own' },
                                { value: 'Rent', label: 'Rent' },
                                { value: 'LivingRentFree', label: 'Rent Free' }
                            ].map((status) => (
                                <button
                                    key={status.value}
                                    type="button"
                                    onClick={() => handleChange('housingStatus', status.value)}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${data.housingStatus === status.value
                                        ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Years at Address"
                            type="number"
                            value={data.yearsAtAddress || ''}
                            onChange={(e) => handleChange('yearsAtAddress', Number(e.target.value))}
                            onBlur={onBlur}
                            highlighted={highlightedFields?.has('currentAddress.yearsAtAddress')}
                            onFocus={() => onFieldFocus?.('currentAddress.yearsAtAddress')}
                        />
                        <Input
                            label="Months at Address"
                            type="number"
                            value={data.monthsAtAddress || ''}
                            onChange={(e) => handleChange('monthsAtAddress', Number(e.target.value))}
                            onBlur={onBlur}
                            highlighted={highlightedFields?.has('currentAddress.monthsAtAddress')}
                            onFocus={() => onFieldFocus?.('currentAddress.monthsAtAddress')}
                        />
                    </div>
                </div>

                {data.housingStatus === 'Rent' && (
                    <div className="md:col-span-2 animate-fade-in">
                        <Input
                            label="Monthly Rent ($)"
                            type="number"
                            value={data.monthlyRent || ''}
                            onChange={(e) => handleChange('monthlyRent', Number(e.target.value))}
                            onBlur={onBlur}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

