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
    <Link href={`/broker/loans/${loan.id}`}>
      <div className="group relative bg-white dark:bg-white/5 backdrop-blur-md rounded-xl p-6 border border-slate-200 dark:border-white/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary-500/50 dark:hover:border-primary-400/50 cursor-pointer overflow-hidden">

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/0 via-primary-500/0 to-primary-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {borrowerName}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono mt-1">
              #{loan.id.slice(0, 8)}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${stageColors[loan.stage]}`}
          >
            {loan.stage.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        </div>

        {/* Property Info */}
        <div className="mb-6 relative z-10">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {propertyAddress}
          </div>
        </div>

        {/* Loan Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 relative z-10 border-t border-slate-100 dark:border-white/5 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 font-bold mb-1">Loan Amount</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              ${loan.property?.loanAmount?.toLocaleString() ?? '0'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 font-bold mb-1">Purchase Price</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              ${loan.property?.purchasePrice?.toLocaleString() ?? '0'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex items-center" title="Documents">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {loan.documents?.length ?? 0}
            </span>
          </div>
          <span>
            {loan.updatedAt ? new Date(loan.updatedAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>
    </Link>
  )
}


