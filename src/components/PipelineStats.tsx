import { LoanStage } from '@/types/shared'

interface PipelineStatsProps {
  loansByStage: Record<LoanStage, number>
  totalLoans: number
}

export function PipelineStats({ loansByStage, totalLoans }: PipelineStatsProps) {
  const stats = [
    {
      label: 'Total Loans',
      value: totalLoans,
      color: 'bg-blue-500',
      icon: '📊',
    },
    {
      label: 'In Progress',
      value: loansByStage.Submitted + loansByStage.PreUnderwriting + loansByStage.Underwriting,
      color: 'bg-yellow-500',
      icon: '⏳',
    },
    {
      label: 'Conditional',
      value: loansByStage.Conditional,
      color: 'bg-orange-500',
      icon: '⚠️',
    },
    {
      label: 'Clear to Close',
      value: loansByStage.ClearToClose,
      color: 'bg-green-500',
      icon: '✅',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} rounded-full p-3`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


