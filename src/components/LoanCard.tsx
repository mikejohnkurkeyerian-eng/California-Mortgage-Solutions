'use client'

import { LoanApplication, LoanStage } from '@/types/shared'
import Link from 'next/link'

interface LoanCardProps {
  loan: LoanApplication
}

const stageColors: Record<LoanStage, string> = {
  Draft: 'bg-gray-100 text-gray-800',
  Submitted: 'bg-blue-100 text-blue-800',
  PreUnderwriting: 'bg-purple-100 text-purple-800',
  Underwriting: 'bg-yellow-100 text-yellow-800',
  SeniorUnderwriting: 'bg-indigo-100 text-indigo-800',
  Conditional: 'bg-orange-100 text-orange-800',
  ClearToClose: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-200 text-gray-900',
}

export function LoanCard({ loan }: LoanCardProps) {
  const borrowerName = loan.borrower ? `${loan.borrower.firstName} ${loan.borrower.lastName}` : 'Unknown Borrower'
  const propertyAddress = loan.property?.address ? `${loan.property.address.city}, ${loan.property.address.state}` : 'Address Not Available'

  return (
    <Link href={`/loans/${loan.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{borrowerName}</h3>
            <p className="text-sm text-gray-500">Loan #{loan.id.slice(0, 8)}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${stageColors[loan.stage]}`}
          >
            {loan.stage}
          </span>
        </div>

        {/* Property Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Property</p>
          <p className="text-sm font-medium text-gray-900">{propertyAddress}</p>
        </div>

        {/* Loan Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
            <p className="text-sm font-semibold text-gray-900">
              ${loan.property?.loanAmount?.toLocaleString() ?? '0'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Purchase Price</p>
            <p className="text-sm font-semibold text-gray-900">
              ${loan.property?.purchasePrice?.toLocaleString() ?? '0'}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {typeof loan.debtToIncomeRatio === 'number' && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Debt-to-Income Ratio</p>
            <p className="text-sm font-semibold text-gray-900">
              {(loan.debtToIncomeRatio * 100).toFixed(1)}%
            </p>
          </div>
        )}

        {/* Documents Count */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📄</span>
            <span>{loan.documents?.length ?? 0} documents</span>
          </div>
          {loan.underwritingDecision && (
            <span className="text-xs font-medium text-gray-600">
              {loan.underwritingDecision}
            </span>
          )}
        </div>

        {/* Last Updated */}
        <div className="mt-3 text-xs text-gray-400">
          Updated {loan.updatedAt ? new Date(loan.updatedAt).toLocaleDateString() : 'N/A'}
        </div>
      </div>
    </Link>
  )
}


