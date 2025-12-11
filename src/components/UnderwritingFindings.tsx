import React from 'react';
import { UnderwritingResult } from '@/lib/automated-underwriting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface UnderwritingFindingsProps {
    result: UnderwritingResult;
}

export function UnderwritingFindings({ result }: UnderwritingFindingsProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PASS': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'FAIL': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'REFER': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    const getDecisionColor = (decision: string) => {
        if (decision.includes('APPROVE')) return 'text-green-400 border-green-500';
        if (decision.includes('REFER')) return 'text-yellow-400 border-yellow-500';
        return 'text-red-400 border-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Top Level Decision */}
            <Card variant="glass" className={`border-l-4 ${getDecisionColor(result.decision)}`}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">AUS Recommendation</CardTitle>
                            <p className="text-slate-400 text-sm mt-1">Automated Underwriting System Findings</p>
                        </div>
                        <div className={`text-3xl font-bold ${getDecisionColor(result.decision).split(' ')[0]}`}>
                            {result.decision}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <MetricBox label="DTI Ratio" value={`${result.metrics.dti.toFixed(2)}%`} />
                        <MetricBox label="LTV Ratio" value={`${result.metrics.ltv.toFixed(2)}%`} />
                        <MetricBox label="Credit Score" value={result.metrics.creditScore.toString()} />
                        <MetricBox label="Reserves" value={`${result.metrics.reserves.toFixed(1)} Mos`} />
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Findings */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Detailed Findings</CardTitle>
                </CardHeader>
                <CardContent>
                    {result.findings.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            No adverse findings. Application meets all standard guidelines.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {result.findings.map((finding, idx) => (
                                <div key={idx} className={`p-4 rounded-lg border flex items-start gap-3 ${getStatusColor(finding.status)}`}>
                                    <div className="mt-1 font-bold text-lg">
                                        {finding.status === 'PASS' ? '✓' : finding.status === 'FAIL' ? '✕' : '!'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm opacity-80">{finding.category} • {finding.ruleId}</div>
                                        <div className="font-medium">{finding.message}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Eligible Programs */}
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Eligible Programs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        {result.eligiblePrograms.map(prog => (
                            <div key={prog.id} className="p-3 bg-white/5 rounded border border-white/10 flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-white">{prog.name}</div>
                                    <div className="text-xs text-slate-400">{prog.type} • Max LTV {prog.maxLTV}%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-primary-400 font-bold">{prog.interestRate}%</div>
                                    <div className="text-xs text-slate-500">Rate</div>
                                </div>
                            </div>
                        ))}
                        {result.eligiblePrograms.length === 0 && (
                            <div className="text-red-400 text-sm">No eligible programs found.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function MetricBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white/5 p-3 rounded border border-white/10">
            <div className="text-slate-400 text-xs uppercase tracking-wider">{label}</div>
            <div className="text-white font-bold text-lg">{value}</div>
        </div>
    );
}
