'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { compareLenders, getRecommendedLender, type LenderComparison } from '@/lib/lender-api'
import type { LoanApplication } from '@shared-types'

interface LenderComparisonProps {
  loan: LoanApplication
}

export function LenderComparison({ loan }: LenderComparisonProps) {
  const [isComparing, setIsComparing] = useState(false)
  const queryClient = useQueryClient()

  const { data: comparisonData, isLoading, refetch } = useQuery({
    queryKey: ['lender-comparison', loan.id],
    queryFn: () => compareLenders(loan.id),
    enabled: false, // Only fetch when manually triggered
    retry: false,
  })

  const handleCompare = () => {
    setIsComparing(true)
    refetch().then(() => {
      setIsComparing(false)
    })
  }

  if (!comparisonData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lender Comparison</h3>
          <p className="text-gray-600 mb-4">
            Compare all configured lenders and get AI recommendation based on best rates and approval likelihood
          </p>
          <button
            onClick={handleCompare}
            disabled={isComparing}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isComparing ? 'Comparing Lenders...' : '🤖 Compare Lenders & Get AI Recommendation'}
          </button>
        </div>
      </div>
    )
  }

  const { comparisons, recommended } = comparisonData

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Comparing lenders...</p>
        </div>
      </div>
    )
  }

  // Sort by score (highest first)
  const sortedComparisons = [...comparisons].sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Lender Comparison</h3>
            <p className="text-sm text-gray-600 mt-1">
              AI has compared {comparisons.length} lender(s) and selected the best one for this loan
            </p>
          </div>
          <button
            onClick={handleCompare}
            disabled={isComparing}
            className="px-4 py-2 text-sm border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 disabled:opacity-50"
          >
            Refresh Comparison
          </button>
        </div>

        {recommended && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-1">
                  🤖 AI Recommended Lender: {recommended.lender.lenderName}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-2">
                  {recommended.rate && (
                    <>
                      <div>
                        <span className="font-medium text-green-800">Interest Rate:</span>
                        <span className="ml-2 text-green-900">{recommended.rate.rate.toFixed(3)}%</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">APR:</span>
                        <span className="ml-2 text-green-900">{recommended.rate.apr.toFixed(3)}%</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">Monthly Payment:</span>
                        <span className="ml-2 text-green-900">
                          ${recommended.rate.estimatedMonthlyPayment.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="font-medium text-green-800">Approval Probability:</span>
                    <span className="ml-2 text-green-900">
                      {recommended.approvalProbability.probability}%
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-green-800">AI Score:</span>
                    <span className="ml-2 text-green-900">{recommended.score.toFixed(1)}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-green-700">
                    <strong>Reasons:</strong> {recommended.approvalProbability.reasons.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">All Lender Comparisons</h4>
          {sortedComparisons.map((comparison, index) => (
            <div
              key={comparison.lender.id || comparison.lender.lenderId}
              className={`p-4 rounded-lg border ${
                comparison.recommended
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h5 className="font-semibold text-gray-900">
                      #{index + 1} {comparison.lender.lenderName}
                    </h5>
                    {comparison.recommended && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        🤖 AI Recommended
                      </span>
                    )}
                    {!comparison.lender.enabled && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                        Disabled
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {comparison.rate ? (
                      <>
                        <div>
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {comparison.rate.rate.toFixed(3)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">APR:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {comparison.rate.apr.toFixed(3)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Monthly Payment:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            ${comparison.rate.estimatedMonthlyPayment.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Fees:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            ${comparison.rate.fees.toLocaleString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="md:col-span-4 text-gray-500">
                        Rate not available (API connection required)
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Approval Probability:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {comparison.approvalProbability.probability}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">AI Score:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {comparison.score.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-600">
                      <strong>Reasons:</strong> {comparison.approvalProbability.reasons.join(', ')}
                    </p>
                    {comparison.approvalProbability.riskFactors.length > 0 && (
                      <p className="text-xs text-orange-600">
                        <strong>Risk Factors:</strong> {comparison.approvalProbability.riskFactors.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {comparisons.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <p>No lenders configured. Add lenders in Settings to compare rates and get AI recommendations.</p>
          </div>
        )}
      </div>
    </div>
  )
}

