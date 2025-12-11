import { LoanDetailView } from '@/components/LoanDetailView'
import Link from 'next/link'

export default function LoanDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-primary-600">
                Broker Console
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Loan Officer</span>
            </div>
          </div>
        </div>
      </nav>
      <LoanDetailView loanId={params.id} />
    </div>
  )
}

