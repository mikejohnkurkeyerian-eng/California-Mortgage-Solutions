import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDocuments, ApplicationStatus } from '@/context/DocumentContext';
import { Input } from '@/components/ui/Input';

export const UnderwriterSimulator = () => {
    const {
        applicationStatus,
        setApplicationStatus,
        addCondition,
        currentLoan
    } = useDocuments();

    const [isExpanded, setIsExpanded] = useState(false);
    const [newConditionTitle, setNewConditionTitle] = useState('');
    const [newConditionDesc, setNewConditionDesc] = useState('');
    const [newConditionType, setNewConditionType] = useState<'document' | 'explanation'>('explanation');

    if (!currentLoan) return null;

    const handleAddCondition = () => {
        if (!newConditionTitle) return;

        addCondition({
            title: newConditionTitle,
            description: newConditionDesc,
            type: newConditionType,
            source: 'underwriter',
            createdAt: new Date().toISOString()
        });

        // If we add a condition, we should ensure status reflects that action is needed
        if (applicationStatus !== 'conditions_pending') {
            setApplicationStatus('conditions_pending');
        }

        setNewConditionTitle('');
        setNewConditionDesc('');
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isExpanded && (
                <Button onClick={() => setIsExpanded(true)} variant="outline" className="shadow-lg bg-slate-900 text-white hover:bg-slate-800">
                    👨‍💼 Underwriter Sim
                </Button>
            )}

            {isExpanded && (
                <Card className="w-80 shadow-2xl border-2 border-slate-700">
                    <CardHeader className="py-3 bg-slate-100 dark:bg-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm">Underwriter Simulator</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="h-6 w-6 p-0">✕</Button>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold">Status Control</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    size="sm"
                                    variant={applicationStatus === 'underwriting' ? 'primary' : 'outline'}
                                    onClick={() => setApplicationStatus('underwriting')}
                                >
                                    Reviewing
                                </Button>
                                <Button
                                    size="sm"
                                    variant={applicationStatus === 'conditions_pending' ? 'primary' : 'outline'}
                                    onClick={() => setApplicationStatus('conditions_pending')}
                                >
                                    Conditions
                                </Button>
                                <Button
                                    size="sm"
                                    variant={applicationStatus === 'approved' ? 'primary' : 'outline'}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => setApplicationStatus('approved')}
                                >
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant={applicationStatus === 'clear_to_close' ? 'primary' : 'outline'}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => setApplicationStatus('clear_to_close')}
                                >
                                    Clear to Close
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 border-t pt-2">
                            <label className="text-xs font-semibold">Add Condition</label>
                            <Input
                                placeholder="Title (e.g. Large Deposit)"
                                value={newConditionTitle}
                                onChange={(e) => setNewConditionTitle(e.target.value)}
                                className="h-8 text-xs"
                            />
                            <Input
                                placeholder="Description"
                                value={newConditionDesc}
                                onChange={(e) => setNewConditionDesc(e.target.value)}
                                className="h-8 text-xs"
                            />
                            <div className="flex gap-2">
                                <select
                                    className="h-8 text-xs border rounded px-2 w-full"
                                    value={newConditionType}
                                    onChange={(e) => setNewConditionType(e.target.value as any)}
                                >
                                    <option value="explanation">Explanation</option>
                                    <option value="document">Document Upload</option>
                                </select>
                                <Button size="sm" onClick={handleAddCondition}>Add</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
