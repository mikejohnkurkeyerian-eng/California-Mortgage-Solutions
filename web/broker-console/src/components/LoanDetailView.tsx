'use client'

import { useQuery } from '@tanstack/react-query'
import { LoanApplication } from '@/types/shared'
import Link from 'next/link'
import { useState } from 'react'
import { LoanOverview } from './LoanOverview'
import { LoanDocuments } from './LoanDocuments'
import { LoanConditions } from './LoanConditions'
import { LoanReview } from './LoanReview'
import { LenderComparison } from './LenderComparison'
import { getLoanById } from '@/lib/api'

interface LoanDetailViewProps {
  loanId: string
}

export function LoanDetailView({ loanId }: LoanDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'overview' | 'documents' | 'conditions' | 'lenders'>('review')

  const { data: loan, isLoading, error } = useQuery({
    queryKey: ['loan', loanId],
    queryFn: () => getLoanById(loanId),
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading loan details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Error loading loan: {(error as Error).message}</p>
          <Link href="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!loan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Loan not found</p>
          <Link href="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Loan Application - {loan.borrower?.firstName ?? 'Unknown'} {loan.borrower?.lastName ?? 'Borrower'}
        </h1>
        <p className="text-gray-600 mt-1">Loan #{loan.id}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('review')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'review'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Review & Approve
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Documents ({loan.documents?.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab('conditions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'conditions'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Conditions ({loan.underwritingConditions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('lenders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'lenders'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Lenders 🤖
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className={activeTab === 'review' || activeTab === 'lenders' ? '' : 'bg-white rounded-lg shadow p-6'}>
        {activeTab === 'review' && <LoanReview loan={loan} />}
        {activeTab === 'overview' && <LoanOverview loan={loan} />}
        {activeTab === 'documents' && <LoanDocuments loan={loan} />}
        {activeTab === 'conditions' && <LoanConditions loan={loan} />}
        {activeTab === 'lenders' && <LenderComparison loan={loan} />}
      </div>
    </div>
  )
}


