'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLoan, useUpdateLoan } from '@/hooks/useBroker';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';

export default function UnderwriterReviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { data: loan, isLoading } = useLoan(id);
    const updateLoanMutation = useUpdateLoan();

    // Condition State
    const [newConditionTitle, setNewConditionTitle] = useState('');
    const [newConditionDesc, setNewConditionDesc] = useState('');
    const [newConditionType, setNewConditionType] = useState<'document' | 'explanation'>('document');

    if (isLoading) return <div className="min-h-screen bg-slate-900 pt-32 text-center text-slate-400">Loading case file...</div>;
    if (!loan) return <div className="min-h-screen bg-slate-900 pt-32 text-center text-slate-400">Loan not found</div>;

    const conditions = (loan as any).conditions || [];

    const handleAddCondition = () => {
        if (!newConditionTitle) return;

        const newCondition = {
            id: Date.now().toString(),
            title: newConditionTitle,
            description: newConditionDesc,
            type: newConditionType,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        updateLoanMutation.mutate({
            id: loan.id,
            data: {
                conditions: [...conditions, newCondition],
                status: 'Conditions Pending' // Auto-update status
            }
        });

        // Reset form
        setNewConditionTitle('');
        setNewConditionDesc('');
    };

    const handleUpdateStatus = (status: string) => {
        updateLoanMutation.mutate({
            id: loan.id,
            data: { status }
        });
        if (status === 'Approved') {
            alert("Loan Approved! Notification sent to Broker.");
            router.push('/underwriter/dashboard');
        }
    };

    return (
        <main className="min-h-screen bg-slate-900 pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <Link href="/underwriter/dashboard" className="text-slate-400 hover:text-white text-sm mb-2 block">← Back to Queue</Link>
                        <h1 className="text-3xl font-bold text-white">Underwriting Review</h1>
                        <p className="text-slate-400">Case #{loan.id.slice(0, 8)} • {loan.borrower?.lastName}</p>
                    </div>
                    <div className="flex gap-3">
                        <span className={`px-4 py-2 rounded-full font-bold border ${loan.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {loan.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: Loan Data */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Borrower & Loan Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="text-slate-300 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-slate-500">Borrower Name</div>
                                        <div>{loan.borrower?.firstName} {loan.borrower?.lastName}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">Credit Score</div>
                                        <div className="font-mono text-green-400">742 (Auto-Pulled)</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">Loan Amount</div>
                                        <div>${loan.property?.loanAmount?.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-500">Property</div>
                                        <div>{loan.property?.address?.street}, {loan.property?.address?.city}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {loan.documents?.map((doc: any, i: number) => (
                                        <li key={i} className="flex justify-between p-3 bg-slate-900/50 rounded border border-slate-700/50">
                                            <span className="text-slate-300">{doc.name || doc.type}</span>
                                            <Button size="sm" variant="ghost" className="text-blue-400 h-auto py-0">View PDF</Button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Col: Decision Engine */}
                    <div className="space-y-6">
                        {/* Decision Actions */}
                        <Card className="bg-slate-800 border-slate-700 border-t-4 border-t-primary-500">
                            <CardHeader>
                                <CardTitle className="text-white">Underwriting Decision</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-500 text-white"
                                    onClick={() => handleUpdateStatus('Approved')}
                                >
                                    Approve Loan
                                </Button>
                                <Button
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white"
                                    onClick={() => handleUpdateStatus('Conditions Pending')}
                                >
                                    Suspend (Request Conditions)
                                </Button>
                                <Button
                                    className="w-full bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900"
                                    onClick={() => handleUpdateStatus('Rejected')}
                                >
                                    Deny Application
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Conditions Manager */}
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white">Conditions Manager</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {conditions.map((c: any) => (
                                        <div key={c.id} className="p-3 bg-slate-900/50 rounded text-sm border border-slate-700">
                                            <div className="font-bold text-white mb-1">{c.title}</div>
                                            <div className="text-slate-400 mb-2">{c.description}</div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded ${c.status === 'cleared' ? 'bg-green-900 text-green-300' : 'bg-amber-900/50 text-amber-300'}`}>
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-slate-700 space-y-3">
                                    <div className="text-sm font-medium text-slate-300">Add New Condition</div>
                                    <Input
                                        placeholder="Title (e.g. Large Deposit Explanation)"
                                        value={newConditionTitle}
                                        onChange={e => setNewConditionTitle(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white"
                                    />
                                    <textarea
                                        placeholder="Description/Actions required..."
                                        rows={3}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-white"
                                        value={newConditionDesc}
                                        onChange={e => setNewConditionDesc(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <select
                                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded px-2"
                                            value={newConditionType}
                                            onChange={e => setNewConditionType(e.target.value as any)}
                                        >
                                            <option value="document">Document Upload</option>
                                            <option value="explanation">Explanation</option>
                                        </select>
                                        <Button className="flex-1" onClick={handleAddCondition}>Add Condition</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
