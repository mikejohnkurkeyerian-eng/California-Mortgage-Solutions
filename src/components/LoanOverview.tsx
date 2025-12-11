import { LoanApplication } from '@/types/shared'

interface LoanOverviewProps {
  loan: LoanApplication
}

export function LoanOverview({ loan }: LoanOverviewProps) {
  const borrowerName = `${loan.borrower.firstName} ${loan.borrower.lastName}`
  const propertyAddress = `${loan.property.address.street}, ${loan.property.address.city}, ${loan.property.address.state} ${loan.property.address.zipCode}`

  return (
    <div className="space-y-6">
      {/* Borrower Information */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrower Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-base text-gray-900 mt-1">{borrowerName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-base text-gray-900 mt-1">{loan.borrower.email}</p>
          </div>
          {loan.borrower.phone && (
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-base text-gray-900 mt-1">{loan.borrower.phone}</p>
            </div>
          )}
        </div>
      </section>

      {/* Property Information */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">Address</label>
            <p className="text-base text-gray-900 mt-1">{propertyAddress}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Property Type</label>
            <p className="text-base text-gray-900 mt-1">{loan.property.propertyType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Purchase Price</label>
            <p className="text-base text-gray-900 mt-1">
              ${loan.property.purchasePrice.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Loan Amount</label>
            <p className="text-base text-gray-900 mt-1">
              ${loan.property.loanAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Down Payment</label>
            <p className="text-base text-gray-900 mt-1">
              ${loan.property.downPayment.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Loan Details */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Loan Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Loan Type</label>
            <p className="text-base text-gray-900 mt-1">{loan.loanType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Loan Purpose</label>
            <p className="text-base text-gray-900 mt-1">{loan.loanPurpose}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Loan Term</label>
            <p className="text-base text-gray-900 mt-1">{loan.loanTerm} months</p>
          </div>
          {loan.interestRate && (
            <div>
              <label className="text-sm font-medium text-gray-500">Interest Rate</label>
              <p className="text-base text-gray-900 mt-1">{loan.interestRate}%</p>
            </div>
          )}
          {loan.debtToIncomeRatio && (
            <div>
              <label className="text-sm font-medium text-gray-500">Debt-to-Income Ratio</label>
              <p className="text-base text-gray-900 mt-1">
                {(loan.debtToIncomeRatio * 100).toFixed(2)}%
              </p>
            </div>
          )}
          {loan.loanToValueRatio && (
            <div>
              <label className="text-sm font-medium text-gray-500">Loan-to-Value Ratio</label>
              <p className="text-base text-gray-900 mt-1">
                {(loan.loanToValueRatio * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Employment Information */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Employment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Employment Status</label>
            <p className="text-base text-gray-900 mt-1">{loan.employment.status}</p>
          </div>
          {loan.employment.employerName && (
            <div>
              <label className="text-sm font-medium text-gray-500">Employer</label>
              <p className="text-base text-gray-900 mt-1">{loan.employment.employerName}</p>
            </div>
          )}
          {loan.employment.monthlyIncome && (
            <div>
              <label className="text-sm font-medium text-gray-500">Monthly Income</label>
              <p className="text-base text-gray-900 mt-1">
                ${loan.employment.monthlyIncome.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Status Information */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Application Status</label>
            <p className="text-base text-gray-900 mt-1">{loan.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Loan Stage</label>
            <p className="text-base text-gray-900 mt-1">{loan.stage}</p>
          </div>
          {loan.underwritingDecision && (
            <div>
              <label className="text-sm font-medium text-gray-500">Underwriting Decision</label>
              <p className="text-base text-gray-900 mt-1">{loan.underwritingDecision}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


