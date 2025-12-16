import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import type { DualAUSResponse, AUSResult, AUSFinding } from '@/lib/aus-engine';

interface AUSResultsProps {
    results: DualAUSResponse;
}

export const AUSResults: React.FC<AUSResultsProps> = ({ results }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                Automated Underwriting System (AUS) Results
            </h3>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                    Recommendation: <span className="font-bold">{results.recommendation}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fannie Mae DU Column */}
                <AUSColumn result={results.du} />

                {/* Freddie Mac LPA Column */}
                <AUSColumn result={results.lpa} />
            </div>
        </div>
    );
};

const AUSColumn = ({ result }: { result: AUSResult }) => {
    const isPassing = result.status === 'Approve/Eligible' || result.status === 'Accept';
    const isRefer = result.status.includes('Refer') || result.status.includes('Caution');

    return (
        <Card className={`p-6 border-2 ${isPassing ? 'border-green-100 dark:border-green-900' : 'border-amber-100 dark:border-amber-900'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{result.agency}</h4>
                    <span className="text-xs text-slate-500">Standard Guidelines v2.4</span>
                </div>
                <Badge variant={isPassing ? 'default' : 'destructive'} className={isPassing ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}>
                    {result.status}
                </Badge>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6 text-sm">
                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-wider">DTI</div>
                    <div className={`font-bold ${result.dti > 50 ? 'text-red-600' : 'text-slate-700 dark:text-slate-200'}`}>
                        {result.dti.toFixed(1)}%
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-wider">LTV</div>
                    <div className={`font-bold ${result.ltv > 97 ? 'text-red-600' : 'text-slate-700 dark:text-slate-200'}`}>
                        {result.ltv.toFixed(1)}%
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-center">
                    <div className="text-slate-500 text-xs uppercase tracking-wider">Reserves</div>
                    <div className="font-bold text-slate-700 dark:text-slate-200">
                        {result.reservesMonths.toFixed(1)} mo
                    </div>
                </div>
            </div>

            {/* Findings List */}
            <div className="space-y-3">
                <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Findings</h5>
                {result.findings.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No specific findings returned.</p>
                ) : (
                    <ul className="space-y-2">
                        {result.findings.map((finding, idx) => (
                            <AUSFindingItem key={idx} finding={finding} />
                        ))}
                    </ul>
                )}
            </div>
        </Card>
    );
};

const AUSFindingItem = ({ finding }: { finding: AUSFinding }) => {
    let Icon = Info;
    let colorClass = 'text-blue-500';

    if (finding.level === 'Success') {
        Icon = CheckCircle2;
        colorClass = 'text-green-500';
    } else if (finding.level === 'Warning') {
        Icon = AlertTriangle;
        colorClass = 'text-amber-500';
    } else if (finding.level === 'Fatal') {
        Icon = XCircle;
        colorClass = 'text-red-500';
    }

    return (
        <li className="flex items-start gap-2 text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colorClass}`} />
            <span className="text-slate-700 dark:text-slate-300">{finding.message}</span>
        </li>
    );
};

