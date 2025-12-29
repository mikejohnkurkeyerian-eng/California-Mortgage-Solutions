'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';

export default function CalculatorsPage() {
    // State for inputs
    const [homePrice, setHomePrice] = useState(500000);
    const [downPayment, setDownPayment] = useState(100000); // 20%
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [propertyTaxRate, setPropertyTaxRate] = useState(1.2); // Annual %
    const [homeInsurance, setHomeInsurance] = useState(1200); // Annual $
    const [hoaFees, setHoaFees] = useState(0); // Monthly $

    // State for outputs
    const [monthlyPrincipalInterest, setMonthlyPrincipalInterest] = useState(0);
    const [monthlyTax, setMonthlyTax] = useState(0);
    const [monthlyInsurance, setMonthlyInsurance] = useState(0);
    const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    // Calculation Logic
    useEffect(() => {
        const loanAmount = homePrice - downPayment;
        const monthlyRate = (interestRate / 100) / 12;
        const numberOfPayments = loanTerm * 12;

        // Principal & Interest
        let pi = 0;
        if (interestRate === 0) {
            pi = loanAmount / numberOfPayments;
        } else {
            pi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        }

        // Taxes & Insurance
        const tax = (homePrice * (propertyTaxRate / 100)) / 12;
        const insurance = homeInsurance / 12;

        setMonthlyPrincipalInterest(pi);
        setMonthlyTax(tax);
        setMonthlyInsurance(insurance);
        setTotalMonthlyPayment(pi + tax + insurance + hoaFees);
    }, [homePrice, downPayment, interestRate, loanTerm, propertyTaxRate, homeInsurance, hoaFees]);

    // Donut Chart Segments (Simulated with Conic Gradient)
    const total = monthlyPrincipalInterest + monthlyTax + monthlyInsurance + hoaFees;
    const piPercent = (monthlyPrincipalInterest / total) * 100;
    const taxPercent = (monthlyTax / total) * 100;
    const insPercent = (monthlyInsurance / total) * 100;
    const hoaPercent = (hoaFees / total) * 100;

    const conicGradient = `conic-gradient(
        #3b82f6 0% ${piPercent}%, 
        #10b981 ${piPercent}% ${piPercent + taxPercent}%, 
        #f59e0b ${piPercent + taxPercent}% ${piPercent + taxPercent + insPercent}%, 
        #ef4444 ${piPercent + taxPercent + insPercent}% 100%
    )`;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
                        Mortgage Calculator
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Estimate your monthly payments with precision. Factor in taxes, insurance, and HOA fees to see the full picture.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 pb-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Inputs Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Loan Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                        Home Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                        <Input
                                            type="number"
                                            className="pl-7"
                                            value={homePrice}
                                            onChange={(e) => setHomePrice(Number(e.target.value))}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="100000"
                                        max="2000000"
                                        step="5000"
                                        value={homePrice}
                                        onChange={(e) => setHomePrice(Number(e.target.value))}
                                        className="w-full mt-2 accent-secondary-600"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                        Down Payment (${((downPayment / homePrice) * 100).toFixed(0)}%)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                        <Input
                                            type="number"
                                            className="pl-7"
                                            value={downPayment}
                                            onChange={(e) => setDownPayment(Number(e.target.value))}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max={homePrice}
                                        step="1000"
                                        value={downPayment}
                                        onChange={(e) => setDownPayment(Number(e.target.value))}
                                        className="w-full mt-2 accent-secondary-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                            Interest Rate (%)
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.125"
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                            Loan Term (Years)
                                        </label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={loanTerm}
                                            onChange={(e) => setLoanTerm(Number(e.target.value))}
                                        >
                                            <option value={30}>30 Years</option>
                                            <option value={20}>20 Years</option>
                                            <option value={15}>15 Years</option>
                                            <option value={10}>10 Years</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Taxes & Insurance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                        Property Tax Rate (%)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={propertyTaxRate}
                                        onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                        Home Insurance ($/yr)
                                    </label>
                                    <Input
                                        type="number"
                                        value={homeInsurance}
                                        onChange={(e) => setHomeInsurance(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                        HOA Fees ($/mo)
                                    </label>
                                    <Input
                                        type="number"
                                        value={hoaFees}
                                        onChange={(e) => setHoaFees(Number(e.target.value))}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Column */}
                    <div className="lg:col-span-2">
                        <Card className="h-full border-2 border-secondary-500/20 shadow-xl overflow-hidden">
                            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="flex justify-between items-center text-2xl">
                                    <span>Estimated Monthly Payment</span>
                                    <span className="text-4xl font-bold text-secondary-600 dark:text-secondary-400">
                                        {formatCurrency(totalMonthlyPayment)}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                    {/* Chart */}
                                    <div className="relative flex justify-center">
                                        <div
                                            className="w-64 h-64 rounded-full relative"
                                            style={{ background: conicGradient }}
                                        >
                                            <div className="absolute inset-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center flex-col">
                                                <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">Total</span>
                                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {formatCurrency(totalMonthlyPayment)}
                                                </span>
                                                <span className="text-slate-400 text-xs mt-1">/ month</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legend / Breakdown */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                                <span className="font-medium text-slate-700 dark:text-slate-200">Principal & Interest</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(monthlyPrincipalInterest)}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                                <span className="font-medium text-slate-700 dark:text-slate-200">Property Taxes</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(monthlyTax)}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                                                <span className="font-medium text-slate-700 dark:text-slate-200">Home Insurance</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(monthlyInsurance)}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                                <span className="font-medium text-slate-700 dark:text-slate-200">HOA Fees</span>
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(hoaFees)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-center">
                                    <Button size="lg" className="bg-secondary-600 hover:bg-secondary-500 text-white min-w-[200px]">
                                        Apply for Pre-Approval
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
