import React from 'react';
import { UnderwritingIssue } from '@/lib/ai-underwriter';

interface RedFlagModalProps {
    isOpen: boolean;
    onClose: () => void;
    issues: UnderwritingIssue[];
}

export const RedFlagModal: React.FC<RedFlagModalProps> = ({ isOpen, onClose, issues }) => {
    if (!isOpen) return null;

    const highSeverityIssues = issues.filter(i => i.severity === 'High');
    const mediumSeverityIssues = issues.filter(i => i.severity === 'Medium');
    const lowSeverityIssues = issues.filter(i => i.severity === 'Low');

    const sortedIssues = [...highSeverityIssues, ...mediumSeverityIssues, ...lowSeverityIssues];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attention Required</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                We found {issues.length} potential issue{issues.length !== 1 ? 's' : ''} with your application.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {sortedIssues.map((issue) => (
                        <div
                            key={issue.id}
                            className={`p-4 rounded-lg border ${issue.severity === 'High'
                                    ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30'
                                    : issue.severity === 'Medium'
                                        ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/30'
                                        : 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 p-1 rounded-full ${issue.severity === 'High' ? 'bg-red-100 text-red-600' :
                                        issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    {issue.severity === 'High' && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 01 18 0z" /></svg>
                                    )}
                                    {issue.severity === 'Medium' && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 01 18 0z" /></svg>
                                    )}
                                    {issue.severity === 'Low' && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 01 18 0z" /></svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className={`font-semibold ${issue.severity === 'High' ? 'text-red-900 dark:text-red-200' :
                                                issue.severity === 'Medium' ? 'text-yellow-900 dark:text-yellow-200' :
                                                    'text-blue-900 dark:text-blue-200'
                                            }`}>
                                            {issue.category} Issue
                                        </h3>
                                        {issue.relatedDocumentId && (
                                            <span className="text-xs px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                                                {issue.relatedDocumentId}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{issue.message}</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action Required:</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{issue.recommendation}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-sm transition-colors"
                    >
                        I'll Fix These
                    </button>
                </div>
            </div>
        </div>
    );
};

