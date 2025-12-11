import { LoanApplication } from '@shared-types'

interface LoanConditionsProps {
  loan: LoanApplication
}

export function LoanConditions({ loan }: LoanConditionsProps) {
  const conditions = loan.underwritingConditions || []
  const pendingConditions = conditions.filter(c => c.status === 'Pending')
  const satisfiedConditions = conditions.filter(c => c.status === 'Satisfied')
  const waivedConditions = conditions.filter(c => c.status === 'Waived')

  if (conditions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No conditions at this time</p>
        {loan.stage === 'PreUnderwriting' && (
          <p className="text-sm text-gray-500 mt-2">
            Conditions will be automatically generated when loan is submitted to underwriting
          </p>
        )}
      </div>
    )
  }

  const conditionsByType = conditions.reduce(
    (acc, condition) => {
      if (!acc[condition.type]) {
        acc[condition.type] = []
      }
      acc[condition.type].push(condition)
      return acc
    },
    {} as Record<string, typeof conditions>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Underwriting Conditions ({conditions.length})
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          {pendingConditions.length > 0 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              {pendingConditions.length} Pending
            </span>
          )}
          {satisfiedConditions.length > 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              {satisfiedConditions.length} Satisfied
            </span>
          )}
          {waivedConditions.length > 0 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
              {waivedConditions.length} Waived
            </span>
          )}
        </div>
      </div>

      {loan.stage === 'PreUnderwriting' && pendingConditions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>🤖 Automated:</strong> The system has automatically requested these condition documents from the borrower. 
            When the borrower uploads the required documents, conditions will be automatically satisfied.
          </p>
        </div>
      )}
      
      {Object.entries(conditionsByType).map(([type, typeConditions]) => (
        <div key={type} className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">{type}</h4>
          <div className="space-y-3">
            {typeConditions.map((condition) => (
              <div
                key={condition.id}
                className={`p-3 rounded-lg ${
                  condition.status === 'Satisfied'
                    ? 'bg-green-50 border border-green-200'
                    : condition.status === 'Waived'
                    ? 'bg-gray-50 border border-gray-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">{condition.description}</p>
                    {condition.requiredDocuments && condition.requiredDocuments.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Required documents: {condition.requiredDocuments.join(", ")}
                      </p>
                    )}
                    {condition.status === 'Pending' && loan.stage === 'PreUnderwriting' && (
                      <p className="text-xs text-blue-600 mt-1">
                        ✅ Auto-requested from borrower
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ml-4 ${
                      condition.status === 'Satisfied'
                        ? 'bg-green-100 text-green-800'
                        : condition.status === 'Waived'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {condition.status}
                  </span>
                </div>
                {condition.status === 'Satisfied' && condition.satisfiedAt && (
                  <p className="text-xs text-gray-600">
                    Satisfied on {new Date(condition.satisfiedAt).toLocaleDateString()}
                  </p>
                )}
                {condition.status === 'Waived' && condition.waivedAt && (
                  <p className="text-xs text-gray-600">
                    Waived on {new Date(condition.waivedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

