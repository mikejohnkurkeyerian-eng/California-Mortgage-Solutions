'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLoan, useUpdateLoan } from '@/hooks/useBroker';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { UnderwritingSubmissionModal } from '@/components/broker/UnderwritingSubmissionModal';
import { LoanDocuments } from '@/components/LoanDocuments';

export default function LoanDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { data: loan, isLoading } = useLoan(id);

    // Submission Modal State
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

    // Messaging State
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');

    // Load messages from localStorage
    useEffect(() => {
        if (id) {
            const saved = localStorage.getItem(`messages_${id}`);
            if (saved) {
                setMessages(JSON.parse(saved));
            }
        }
    }, [id]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            text: newMessage,
            sender: 'Broker',
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, msg];
        setMessages(updatedMessages);
        localStorage.setItem(`messages_${id}`, JSON.stringify(updatedMessages));
        setNewMessage('');
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-32 flex justify-center">
                    <div className="text-slate-400">Loading loan details...</div>
                </div>
            </main>
        );
    }

    if (!loan) {
        return (
            <main className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-32 flex flex-col items-center">
                    <div className="text-slate-400 mb-4">Loan application not found</div>
                    <Link href="/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="pt-32 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/broker/dashboard" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                    ← Back to Dashboard
                                </Link>
                                <span className="text-slate-400 dark:text-slate-600">|</span>
                                <span className="text-slate-500 dark:text-slate-400">Application #{loan.id.slice(0, 8)}</span>
                            </div>
                            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
                                {loan.borrower?.firstName} {loan.borrower?.lastName}
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="text-red-400 border-red-400/20 hover:bg-red-400/10">
                                Reject Application
                            </Button>
                            {loan.stage === 'Underwriting' && (
                                <Button className="bg-indigo-600 hover:bg-indigo-500">
                                    Submit to Senior Underwriter
                                </Button>
                            )}
                            {loan.stage === 'SeniorUnderwriting' && (
                                <Button className="bg-green-600 hover:bg-green-500">
                                    Approve (Clear to Close)
                                </Button>
                            )}
                            {loan.stage !== 'Closed' && (
                                <Button
                                    className="bg-secondary-600 hover:bg-secondary-500"
                                    onClick={() => setIsSubmissionModalOpen(true)}
                                >
                                    Submit to Underwriting...
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Loan Details Card */}
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Loan Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Amount Requested</p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">${loan.property?.loanAmount?.toLocaleString() || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Purpose</p>
                                            <p className="text-lg text-slate-900 dark:text-white capitalize">{loan.loanPurpose}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Term</p>
                                            <p className="text-lg text-slate-900 dark:text-white">{loan.loanTerm} months</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Status</p>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                                                ${loan.status === 'Approved' ? 'bg-secondary-500/10 text-secondary-400' :
                                                    loan.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                                                        'bg-primary-500/10 text-primary-400'}`}>
                                                {loan.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Applied On</p>
                                            <p className="text-slate-900 dark:text-white">{new Date(loan.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Borrower Info Card */}
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Borrower Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email</p>
                                            <p className="text-slate-900 dark:text-white">{loan.borrower?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Phone</p>
                                            <p className="text-slate-900 dark:text-white">{loan.borrower?.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Employment Status</p>
                                            <p className="text-slate-900 dark:text-white capitalize">{loan.employment?.status?.replace('_', ' ') || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Annual Income</p>
                                            <p className="text-slate-900 dark:text-white">${(loan.employment?.monthlyIncome ? loan.employment.monthlyIncome * 12 : 0).toLocaleString()}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Property Address</p>
                                            <p className="text-slate-900 dark:text-white">
                                                {loan.property?.address ? (
                                                    <>
                                                        {loan.property.address.street}<br />
                                                        {loan.property.address.city}, {loan.property.address.state} {loan.property.address.zipCode}
                                                    </>
                                                ) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Automated Underwriting Card */}
                            <Card variant="glass">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Automated Underwriting (DU/LPA)</CardTitle>
                                        <Button size="sm" className="bg-primary-600 hover:bg-primary-500">
                                            Run Analysis
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="p-3 bg-white/5 rounded border border-white/10 text-center">
                                                <div className="text-xs text-slate-400 mb-1">DTI Ratio</div>
                                                <div className="text-xl font-bold text-green-400">25.0%</div>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded border border-white/10 text-center">
                                                <div className="text-xs text-slate-400 mb-1">LTV Ratio</div>
                                                <div className="text-xl font-bold text-blue-400">80.0%</div>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded border border-white/10 text-center">
                                                <div className="text-xs text-slate-400 mb-1">Credit Score</div>
                                                <div className="text-xl font-bold text-white">720</div>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded border border-white/10 text-center">
                                                <div className="text-xs text-slate-400 mb-1">Status</div>
                                                <div className="text-xl font-bold text-green-400">Approvable</div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-slate-300 mb-3">Eligible Programs</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                                                        <span className="text-white font-medium">30-Year Fixed Conventional</span>
                                                    </div>
                                                    <span className="text-green-400 text-sm font-bold">Approved</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                                                        <span className="text-white font-medium">30-Year Fixed FHA</span>
                                                    </div>
                                                    <span className="text-green-400 text-sm font-bold">Approved</span>
                                                </div>
                                            </div>
                                        </div>

                                        {(loan as any).selectedProgram && (
                                            <div className="mt-6 pt-6 border-t border-white/10">
                                                <h4 className="text-sm font-medium text-slate-300 mb-3">Borrower Selected Program</h4>
                                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h5 className="text-white font-bold text-lg">{(loan as any).selectedProgram.name}</h5>
                                                            <p className="text-blue-200 text-sm">{(loan as any).selectedProgram.type} • {(loan as any).selectedProgram.term} Year Fixed</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-white">{(loan as any).selectedProgram.rate}%</div>
                                                            <div className="text-xs text-blue-300">Interest Rate</div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                                                        <div>
                                                            <p className="text-slate-400">Monthly P&I</p>
                                                            <p className="text-white font-medium">${(loan as any).selectedProgram.monthlyPayment.toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-400">APR</p>
                                                            <p className="text-white font-medium">{(loan as any).selectedProgram.apr}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-400">Closing Costs</p>
                                                            <p className="text-white font-medium">${(loan as any).selectedProgram.closingCosts.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>


                            {/* Multi-Lender Submissions Card */}
                            {(loan as any).submissions && (loan as any).submissions.length > 0 && (
                                <Card variant="glass">
                                    <CardHeader>
                                        <CardTitle>Lender Submissions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {(loan as any).submissions.map((sub: any) => (
                                                <div key={sub.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h5 className="text-white font-bold">{sub.lenderName || sub.recipient || 'Unknown Recipient'}</h5>
                                                            <p className="text-slate-400 text-sm">
                                                                <span className="opacity-70 mr-1">[{sub.type || 'LENDER'}]</span>
                                                                {new Date(sub.submittedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium
                                                            ${sub.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                                                sub.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                                    'bg-blue-500/20 text-blue-400'}`}>
                                                            {sub.status}
                                                        </span>
                                                    </div>
                                                    {sub.notes && (
                                                        <p className="text-sm text-slate-300 mt-2 bg-black/20 p-2 rounded">
                                                            {sub.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Documents Card (Now using Component) */}
                            <LoanDocuments loan={loan} />

                            {/* Messaging Card */}
                            <Card variant="glass">
                                <CardHeader>
                                    <CardTitle>Borrower Communication</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="h-64 overflow-y-auto space-y-3 p-3 bg-white/5 rounded border border-white/10">
                                            {messages.length > 0 ? (
                                                messages.map((msg: any, i: number) => (
                                                    <div key={i} className={`flex flex-col ${msg.sender === 'Broker' ? 'items-end' : 'items-start'}`}>
                                                        <div className={`max-w-[80%] p-2 rounded-lg text-sm ${msg.sender === 'Broker'
                                                            ? 'bg-primary-600 text-white rounded-br-none'
                                                            : 'bg-slate-700 text-slate-200 rounded-bl-none'
                                                            }`}>
                                                            {msg.text}
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 mt-1">
                                                            {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                                    No messages yet. Start the conversation!
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Type a message..."
                                                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            />
                                            <Button size="sm" onClick={handleSendMessage}>
                                                Send
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div >
            </div >

            <UnderwritingSubmissionModal
                isOpen={isSubmissionModalOpen}
                onClose={() => setIsSubmissionModalOpen(false)}
                loan={loan}
            />
        </main >
    );
}
