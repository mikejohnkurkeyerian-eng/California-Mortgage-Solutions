'use client'

import { useState, useEffect, useMemo } from 'react'
import { LoanApplication } from '@/types/shared'
import { updateLoan, runAUS, approveLoan } from '@/lib/api'
import { Form1003View } from './Form1003View'
import { AIUnderwriter, AIAnalysisResult } from '@/lib/ai-underwriter'
import { classifyDocument, ClassificationResult } from '@/lib/document-ai'

interface LoanReviewProps {
  loan: LoanApplication
  onClose?: () => void
}

export function LoanReview({ loan, onClose }: LoanReviewProps) {
  const [activeTab, setActiveTab] = useState<'review' | '1003'>('review')
  const [isEditing, setIsEditing] = useState(false)
  const [editedLoan, setEditedLoan] = useState<LoanApplication>(loan)
  const [ausResult, setAusResult] = useState<any>(null)
  const [isRunningAus, setIsRunningAus] = useState(false)
  const [showAdditionalExpenses, setShowAdditionalExpenses] = useState(false)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null)

  useEffect(() => {
    setEditedLoan(loan)
  }, [loan])

  const totalMonthlyPayment = useMemo(() => {
    const loanAmount = editedLoan?.property?.loanAmount || 0
    const pAndI = calculatePrincipalAndInterest(
      loanAmount,
      editedLoan?.interestRate || 0,
      editedLoan?.loanTerm || 360
    )
    const taxes = (editedLoan?.property?.propertyTaxes || 0) / 12
    const insurance = (editedLoan?.property?.homeownersInsurance || 0) / 12
    const hoa = editedLoan?.property?.hoaDues || 0
    const mortgageIns = editedLoan?.monthlyMortgageInsurance || 0
    const other = (editedLoan?.property?.floodInsurance || 0) / 12 +
      (editedLoan?.property?.groundRent || 0) +
      (editedLoan?.property?.leaseholdPayments || 0) +
      (editedLoan?.property?.otherHousingExpenses || 0)

    return pAndI + taxes + insurance + hoa + mortgageIns + other
  }, [editedLoan])

  const totalCashToClose = useMemo(() => {
    if (!editedLoan.transactionDetails) return 0
    const details = editedLoan.transactionDetails
    const costs = (details.alterationsImprovements || 0) +
      (details.land || 0) +
      (details.refinanceDebts || 0) +
      (details.prepaidItems || 0) +
      (details.closingCosts || 0) +
      (details.pmiMipFundingFee || 0) +
      (editedLoan?.property?.purchasePrice || 0)

    const credits = (editedLoan?.property?.loanAmount || 0) +
      (details.otherCredits || 0) +
      (details.sellerCredits || 0)

    return costs - credits
  }, [editedLoan])

  const handleSave = async () => {
    try {
      await updateLoan(editedLoan.id, editedLoan)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save loan', error)
    }
  }

  const handleRunAUS = async () => {
    setIsRunningAus(true)
    try {
      const result = await runAUS(editedLoan.id)
      setAusResult(result)
    } catch (error) {
      console.error('Failed to run AUS', error)
    } finally {
      setIsRunningAus(false)
    }
  }

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      // Fetch and process documents
      const processedDocs: ClassificationResult[] = []

      // Simulate fetching file content based on document type
      // In a real app, we would fetch the file blobs from the document URLs
      if (editedLoan.documents && editedLoan.documents.length > 0) {
        for (const doc of editedLoan.documents) {
          let content = ""

          if (doc.type === 'PayStub') {
            // Simulate paystub content
            content = `
                  PAY STUB
                  Employer: ${editedLoan?.employment?.employerName || 'Unknown Employer'}
                  Period: 01/01/2024 - 01/15/2024
                  Gross Pay: $${(editedLoan?.employment?.monthlyIncome ? (editedLoan.employment.monthlyIncome / 2).toFixed(2) : '0.00')}
                  Net Pay: $${(editedLoan?.employment?.monthlyIncome ? (editedLoan.employment.monthlyIncome / 2 * 0.75).toFixed(2) : '0.00')}
              `
          } else if (doc.type === 'BankStatement') {
            content = `
                  BANK STATEMENT
                  Account: ${editedLoan.assets[0]?.accountNumber || '1234'}
                  
                  Transactions:
                  01/05/2024 Deposit $10,000.00
                  01/10/2024 Withdrawal $500.00
              `
          } else if (doc.type === 'W2') {
            content = `
                  W-2 Wage and Tax Statement
                  Employer: ${editedLoan?.employment?.employerName || 'Unknown Employer'}
                  Wages, tips, other compensation: $${(editedLoan?.employment?.monthlyIncome ? (editedLoan.employment.monthlyIncome * 12).toFixed(2) : '0.00')}
               `
          } else {
            content = `Document Type: ${doc.type}\nContent not simulated.`
          }

          const file = new File([content], doc.fileName || 'document.txt', { type: 'text/plain' })

          // Use the document-ai service to classify and extract text
          const result = await classifyDocument(file)

          // Override the type with the known metadata type for this demo
          result.type = doc.type as any

          processedDocs.push(result)
        }
      }

      // Run Analysis
      const result = AIUnderwriter.analyze(editedLoan, processedDocs)

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      setAiResult(result)
    } catch (error) {
      console.error("AI Analysis failed", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleApprove = async () => {
    try {
      await approveLoan(editedLoan.id)
    } catch (error) {
      console.error('Failed to approve loan', error)
    }
  }

  const updateBorrower = (field: keyof typeof editedLoan.borrower, value: any) => {
    setEditedLoan({
      ...editedLoan,
      borrower: { ...editedLoan.borrower, [field]: value }
    })
  }

  const updateProperty = (field: keyof typeof editedLoan.property, value: any) => {
    setEditedLoan({
      ...editedLoan,
      property: { ...editedLoan.property, [field]: value }
    })
  }

  const updatePropertyAddress = (field: keyof typeof editedLoan.property.address, value: any) => {
    setEditedLoan({
      ...editedLoan,
      property: {
        ...editedLoan.property,
        address: { ...editedLoan.property.address, [field]: value }
      }
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 bg-surface/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 sticky top-4 z-10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(editedLoan.status)}`}>
              {editedLoan.status}
            </div>
            <h2 className="text-lg font-heading font-semibold text-white">
              {editedLoan?.borrower?.lastName}, {editedLoan?.borrower?.firstName}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setEditedLoan(loan)
                    setIsEditing(false)
                  }}
                  className="px-6 py-2.5 border border-white/10 bg-surface/50 text-white rounded-xl hover:bg-surface hover:border-white/20 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 border border-white/10 bg-surface/50 text-white rounded-xl hover:bg-surface hover:border-white/20 transition-all duration-200"
                >
                  Edit Loan
                </button>
                <button
                  onClick={handleRunAUS}
                  disabled={isRunningAus}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isRunningAus ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running AUS...
                    </>
                  ) : (
                    'Run AUS'
                  )}
                </button>
                <button
                  onClick={handleRunAIAnalysis}
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Analysis
                    </>
                  )}
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-emerald-900/20"
                >
                  Approve Loan
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'review'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Loan Review
          </button>
          <button
            onClick={() => setActiveTab('1003')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === '1003'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            1003 Form
          </button>
        </div>
      </div>

      {
        activeTab === '1003' ? (
          <Form1003View loan={editedLoan} />
        ) : (
          <>
            {/* AI Analysis Results */}
            {aiResult && (
              <div className="glass-card p-6 border-l-4 border-l-purple-500 mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading font-semibold text-white">AI Underwriter Analysis</h3>
                      <span className="text-xs px-2 py-0.5 rounded border bg-purple-500/20 text-purple-300 border-purple-500/30">
                        AI Powered
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">
                      Readiness Score: {aiResult.score}/100
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{aiResult.summary}</p>
                  </div>
                </div>

                {aiResult.issues.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Detected Issues</h4>
                    <div className="space-y-3">
                      {aiResult.issues.map((issue, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5">
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${issue.severity === 'High' ? 'bg-red-500' :
                              issue.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                              }`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="text-sm font-medium text-white">{issue.category} Issue</h5>
                                <span className={`text-xs px-2 py-0.5 rounded ${issue.severity === 'High' ? 'bg-red-500/20 text-red-300' :
                                  issue.severity === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                                  }`}>{issue.severity}</span>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">{issue.message}</p>

                              <div className="flex items-center justify-between bg-black/20 rounded p-2 mt-2">
                                <p className="text-xs text-slate-400">
                                  <span className="font-medium text-slate-300">Recommendation:</span> {issue.recommendation}
                                </p>
                                <button
                                  onClick={() => console.log('Requesting info for:', issue.id)}
                                  className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                                >
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                  Request Info
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AUS Results */}
            {ausResult && (
              <div className={`glass-card p-6 border-l-4 ${ausResult.recommendation === 'Approve/Eligible' ? 'border-l-emerald-500' :
                ausResult.recommendation === 'Refer/Ineligible' ? 'border-l-red-500' : 'border-l-amber-500'
                }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading font-semibold text-white">AUS Recommendation</h3>
                      <span className={`text-xs px-2 py-0.5 rounded border ${ausResult.mode === 'Real'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                        }`}>
                        {ausResult.mode} Mode
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${ausResult.recommendation === 'Approve/Eligible' ? 'text-emerald-400' :
                      ausResult.recommendation === 'Refer/Ineligible' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                      {ausResult.recommendation}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Submission ID</p>
                    <p className="text-sm font-mono text-white">{ausResult.id}</p>
                  </div>
                </div>

                {ausResult.findings && ausResult.findings.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Key Findings</h4>
                    <ul className="space-y-2">
                      {ausResult.findings.map((finding: any, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${finding.severity === 'Info' ? 'bg-blue-400' :
                            finding.severity === 'Warning' ? 'bg-amber-400' : 'bg-red-400'
                            }`} />
                          {finding.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Security Logs */}
                {ausResult.logs && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Security Audit Log
                    </h4>
                    <div className="bg-black/40 rounded-lg p-3 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
                      {ausResult.logs.map((log: any, i: number) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className={`${log.level === 'SECURE' ? 'text-emerald-400' :
                            log.level === 'ERROR' ? 'text-red-400' :
                              'text-blue-300'
                            }`}>[{log.level}]</span>
                          <span className="text-slate-300">{log.action}:</span>
                          <span className="text-slate-400">{log.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Borrower Info */}
                <section className="glass-panel p-6">
                  <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Borrower Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <ReviewField
                      label="First Name"
                      value={editedLoan?.borrower?.firstName || ''}
                      editable={isEditing}
                      onChange={(v) => updateBorrower('firstName', v)}
                    />
                    <ReviewField
                      label="Last Name"
                      value={editedLoan?.borrower?.lastName || ''}
                      editable={isEditing}
                      onChange={(v) => updateBorrower('lastName', v)}
                    />
                    <ReviewField
                      label="Email"
                      value={editedLoan?.borrower?.email || ''}
                      editable={isEditing}
                      onChange={(v) => updateBorrower('email', v)}
                    />
                    <ReviewField
                      label="Phone"
                      value={editedLoan?.borrower?.phone || ''}
                      editable={isEditing}
                      onChange={(v) => updateBorrower('phone', v)}
                    />
                  </div>
                </section>

                {/* Property Info */}
                <section className="glass-panel p-6">
                  <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                    Property Details
                  </h3>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="col-span-2">
                      <ReviewField
                        label="Street Address"
                        value={editedLoan?.property?.address?.street || ''}
                        editable={isEditing}
                        onChange={(v) => updatePropertyAddress('street', v)}
                      />
                    </div>
                    <ReviewField
                      label="City"
                      value={editedLoan?.property?.address?.city || ''}
                      editable={isEditing}
                      onChange={(v) => updatePropertyAddress('city', v)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <ReviewField
                        label="State"
                        value={editedLoan?.property?.address?.state || ''}
                        editable={isEditing}
                        onChange={(v) => updatePropertyAddress('state', v)}
                      />
                      <ReviewField
                        label="Zip Code"
                        value={editedLoan?.property?.address?.zipCode || ''}
                        editable={isEditing}
                        onChange={(v) => updatePropertyAddress('zipCode', v)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                    <ReviewField
                      label="Property Type"
                      value={editedLoan?.property?.propertyType || ''}
                      editable={isEditing}
                      onChange={(v) => updateProperty('propertyType', v)}
                    />
                    <ReviewField
                      label="Purchase Price"
                      value={(editedLoan?.property?.purchasePrice || 0).toString()}
                      editable={isEditing}
                      format="currency"
                      onChange={(v) => updateProperty('purchasePrice', parseFloat(v) || 0)}
                    />
                    <ReviewField
                      label="Appraised Value"
                      value={(editedLoan?.property?.purchasePrice || 0).toString()} // Using purchase price as proxy for now
                      editable={false}
                      format="currency"
                    />
                  </div>
                </section>

                {/* Assets & Reserves */}
                <section className="glass-panel p-6">
                  <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                    Assets & Reserves
                  </h3>
                  <div className="space-y-4">
                    {editedLoan?.assets?.map && editedLoan.assets.map((asset, index) => (
                      <div key={asset.id} className="grid grid-cols-4 gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <ReviewField
                          label="Type"
                          value={asset.type}
                          editable={isEditing}
                          onChange={(v) => {
                            const newAssets = [...editedLoan.assets]
                            newAssets[index] = { ...asset, type: v as any }
                            setEditedLoan({ ...editedLoan, assets: newAssets })
                          }}
                        />
                        <ReviewField
                          label="Institution"
                          value={asset.institution}
                          editable={isEditing}
                          onChange={(v) => {
                            const newAssets = [...editedLoan.assets]
                            newAssets[index] = { ...asset, institution: v }
                            setEditedLoan({ ...editedLoan, assets: newAssets })
                          }}
                        />
                        <ReviewField
                          label="Account #"
                          value={asset.accountNumber || ''}
                          editable={isEditing}
                          onChange={(v) => {
                            const newAssets = [...editedLoan.assets]
                            newAssets[index] = { ...asset, accountNumber: v }
                            setEditedLoan({ ...editedLoan, assets: newAssets })
                          }}
                        />
                        <ReviewField
                          label="Balance"
                          value={asset.currentBalance.toString()}
                          editable={isEditing}
                          format="currency"
                          onChange={(v) => {
                            const newAssets = [...editedLoan.assets]
                            newAssets[index] = { ...asset, currentBalance: parseFloat(v) || 0 }
                            setEditedLoan({ ...editedLoan, assets: newAssets })
                          }}
                        />
                      </div>
                    ))}
                    <div className="flex justify-end pt-4 border-t border-white/10">
                      <div className="text-right">
                        <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Total Assets</p>
                        <p className="text-2xl font-bold text-emerald-400">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                            editedLoan?.assets?.reduce((sum, a) => sum + a.currentBalance, 0) || 0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Liabilities & Debts */}
                <section className="glass-panel p-6">
                  <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                    Liabilities & Debts
                  </h3>
                  <div className="space-y-4">
                    {editedLoan?.debts?.map && editedLoan.debts.map((debt, index) => (
                      <div key={debt.id} className="grid grid-cols-5 gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <ReviewField
                          label="Type"
                          value={debt.type}
                          editable={isEditing}
                          onChange={(v) => {
                            const newDebts = [...editedLoan.debts]
                            newDebts[index] = { ...debt, type: v as any }
                            setEditedLoan({ ...editedLoan, debts: newDebts })
                          }}
                        />
                        <ReviewField
                          label="Creditor"
                          value={debt.creditor}
                          editable={isEditing}
                          onChange={(v) => {
                            const newDebts = [...editedLoan.debts]
                            newDebts[index] = { ...debt, creditor: v }
                            setEditedLoan({ ...editedLoan, debts: newDebts })
                          }}
                        />
                        <ReviewField
                          label="Account #"
                          value={debt.accountNumber || ''}
                          editable={isEditing}
                          onChange={(v) => {
                            const newDebts = [...editedLoan.debts]
                            newDebts[index] = { ...debt, accountNumber: v }
                            setEditedLoan({ ...editedLoan, debts: newDebts })
                          }}
                        />
                        <ReviewField
                          label="Monthly Pmt"
                          value={debt.monthlyPayment.toString()}
                          editable={isEditing}
                          format="currency"
                          onChange={(v) => {
                            const newDebts = [...editedLoan.debts]
                            newDebts[index] = { ...debt, monthlyPayment: parseFloat(v) || 0 }
                            setEditedLoan({ ...editedLoan, debts: newDebts })
                          }}
                        />
                        <ReviewField
                          label="Balance"
                          value={debt.currentBalance.toString()}
                          editable={isEditing}
                          format="currency"
                          onChange={(v) => {
                            const newDebts = [...editedLoan.debts]
                            newDebts[index] = { ...debt, currentBalance: parseFloat(v) || 0 }
                            setEditedLoan({ ...editedLoan, debts: newDebts })
                          }}
                        />
                      </div>
                    ))}
                    <div className="flex justify-end pt-4 border-t border-white/10">
                      <div className="text-right">
                        <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Total Monthly Liabilities</p>
                        <p className="text-2xl font-bold text-red-400">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                            editedLoan?.debts?.reduce((sum, d) => sum + d.monthlyPayment, 0) || 0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Transaction Details (Collapsible) */}
                <section className="glass-panel p-6">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowTransactionDetails(!showTransactionDetails)}
                  >
                    <h3 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
                      <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                      Transaction Details
                    </h3>
                    <button className="text-slate-400 hover:text-white">
                      {showTransactionDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>

                  {showTransactionDetails && (
                    <div className="mt-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
                      <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider border-b border-white/10 pb-2">Costs</h4>
                          <ReviewField
                            label="a. Purchase Price"
                            value={(editedLoan?.property?.purchasePrice || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => updateProperty('purchasePrice', parseFloat(v) || 0)}
                          />
                          <ReviewField
                            label="b. Alterations/Improvements"
                            value={(editedLoan.transactionDetails?.alterationsImprovements || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => setEditedLoan({
                              ...editedLoan,
                              transactionDetails: { ...editedLoan.transactionDetails, alterationsImprovements: parseFloat(v) || 0 }
                            })}
                          />
                          <ReviewField
                            label="c. Land"
                            value={(editedLoan.transactionDetails?.land || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => setEditedLoan({
                              ...editedLoan,
                              transactionDetails: { ...editedLoan.transactionDetails, land: parseFloat(v) || 0 }
                            })}
                          />
                          <ReviewField
                            label="d. Refinance (incl. debts to be paid off)"
                            value={(editedLoan.transactionDetails?.refinanceDebts || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => setEditedLoan({
                              ...editedLoan,
                              transactionDetails: { ...editedLoan.transactionDetails, refinanceDebts: parseFloat(v) || 0 }
                            })}
                          />
                          <ReviewField
                            label="e. Estimated Prepaid Items"
                            value={(editedLoan.transactionDetails?.prepaidItems || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => setEditedLoan({
                              ...editedLoan,
                              transactionDetails: { ...editedLoan.transactionDetails, prepaidItems: parseFloat(v) || 0 }
                            })}
                          />
                          <ReviewField
                            label="f. Estimated Closing Costs"
                            value={(editedLoan.transactionDetails?.closingCosts || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => setEditedLoan({
                              ...editedLoan,
                              transactionDetails: { ...editedLoan.transactionDetails, closingCosts: parseFloat(v) || 0 }
                            })}
                          />
                          <ReviewField
                            label="g. PMI, MIP, Funding Fee"
                            value={(editedLoan.transactionDetails?.pmiMipFundingFee || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => setEditedLoan({
                              ...editedLoan,
                              transactionDetails: { ...editedLoan.transactionDetails, pmiMipFundingFee: parseFloat(v) || 0 }
                            })}
                          />
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider border-b border-white/10 pb-2">Credits</h4>
                          <ReviewField
                            label="i. Loan Amount"
                            value={(editedLoan?.property?.loanAmount || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => updateProperty('loanAmount', parseFloat(v) || 0)}
                          />
                          <ReviewField
                            label="j. Other Credits"
                            value={(editedLoan.transactionDetails?.otherCredits || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => setEditedLoan({
                              ...editedLoan,
                              transactionDetails: { ...editedLoan.transactionDetails, otherCredits: parseFloat(v) || 0 }
                            })}
                          />
                          <ReviewField
                            label="k. Seller Credits"
                            value={(editedLoan.transactionDetails?.sellerCredits || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => setEditedLoan({
                              ...editedLoan,
                              transactionDetails: { ...editedLoan.transactionDetails, sellerCredits: parseFloat(v) || 0 }
                            })}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t border-white/10">
                        <div className="text-right">
                          <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">Total Cash to Close</p>
                          <p className="text-3xl font-bold text-white">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalCashToClose)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column - Loan Details & Payment */}
              <div className="space-y-8">
                {/* Proposed Monthly Payment */}
                <section className="glass-panel p-6">
                  <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Proposed Monthly Payment
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-slate-400">Principal & Interest</span>
                      <span className="text-white font-medium">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                          calculatePrincipalAndInterest(
                            editedLoan?.property?.loanAmount || 0,
                            editedLoan?.interestRate || 0,
                            editedLoan?.loanTerm || 360
                          )
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <ReviewField
                        label="Property Taxes (Mo)"
                        value={((editedLoan?.property?.propertyTaxes || 0) / 12).toFixed(2)}
                        editable={isEditing}
                        format="currency"
                        onChange={(v) => updateProperty('propertyTaxes', (parseFloat(v) || 0) * 12)}
                      />
                      <ReviewField
                        label="Homeowner's Ins (Mo)"
                        value={((editedLoan?.property?.homeownersInsurance || 0) / 12).toFixed(2)}
                        editable={isEditing}
                        format="currency"
                        onChange={(v) => updateProperty('homeownersInsurance', (parseFloat(v) || 0) * 12)}
                      />
                      <ReviewField
                        label="HOA Dues (Mo)"
                        value={(editedLoan?.property?.hoaDues || 0).toString()}
                        editable={isEditing}
                        format="currency"
                        onChange={(v) => updateProperty('hoaDues', parseFloat(v) || 0)}
                      />
                      <ReviewField
                        label="Mortgage Ins (Mo)"
                        value={(editedLoan.monthlyMortgageInsurance || 0).toString()}
                        editable={isEditing}
                        format="currency"
                        onChange={(v) => setEditedLoan({ ...editedLoan, monthlyMortgageInsurance: parseFloat(v) || 0 })}
                      />
                    </div>

                    {/* Collapsible Additional Expenses */}
                    <div className="pt-2">
                      <button
                        onClick={() => setShowAdditionalExpenses(!showAdditionalExpenses)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mb-3"
                      >
                        {showAdditionalExpenses ? '- Hide Additional Expenses' : '+ Show Additional Expenses'}
                      </button>

                      {showAdditionalExpenses && (
                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200 mb-4">
                          <ReviewField
                            label="Flood Ins (Mo)"
                            value={((editedLoan.property.floodInsurance || 0) / 12).toFixed(2)}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => updateProperty('floodInsurance', (parseFloat(v) || 0) * 12)}
                          />
                          <ReviewField
                            label="Ground Rent (Mo)"
                            value={(editedLoan.property.groundRent || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => updateProperty('groundRent', parseFloat(v) || 0)}
                          />
                          <ReviewField
                            label="Leasehold Pmt (Mo)"
                            value={(editedLoan.property.leaseholdPayments || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => updateProperty('leaseholdPayments', parseFloat(v) || 0)}
                          />
                          <ReviewField
                            label="Other Housing Exp (Mo)"
                            value={(editedLoan.property.otherHousingExpenses || 0).toString()}
                            editable={isEditing}
                            format="currency"
                            onChange={(v) => updateProperty('otherHousingExpenses', parseFloat(v) || 0)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Monthly Payment</span>
                        <span className="text-3xl font-bold text-amber-400">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalMonthlyPayment)}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Loan Details */}
                <section className="glass-panel p-6">
                  <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                    Loan Details
                  </h3>
                  <div className="space-y-4">
                    <ReviewField
                      label="Loan Type"
                      value={editedLoan.loanType}
                      editable={isEditing}
                      onChange={(v) => setEditedLoan({ ...editedLoan, loanType: v as any })}
                    />
                    <ReviewField
                      label="Loan Purpose"
                      value={editedLoan.loanPurpose}
                      editable={isEditing}
                      onChange={(v) => setEditedLoan({ ...editedLoan, loanPurpose: v as any })}
                    />
                    <ReviewField
                      label="Loan Term (Months)"
                      value={(editedLoan?.loanTerm || 360).toString()}
                      editable={isEditing}
                      onChange={(v) => setEditedLoan({ ...editedLoan, loanTerm: parseInt(v) || 360 })}
                    />
                    <ReviewField
                      label="Interest Rate (%)"
                      value={editedLoan.interestRate?.toString() || ''}
                      editable={isEditing}
                      onChange={(v) => setEditedLoan({ ...editedLoan, interestRate: parseFloat(v) || 0 })}
                    />
                    <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-medium text-slate-500 mb-1">LTV</label>
                        <p className="text-lg font-bold text-white">
                          {(((editedLoan?.property?.loanAmount || 0) / (editedLoan?.property?.purchasePrice || 1)) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}

function calculatePrincipalAndInterest(principal: number, rate: number, termMonths: number) {
  if (rate === 0) return principal / termMonths;
  const monthlyRate = rate / 100 / 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Approved': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'Rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'Submitted': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
}

interface ReviewFieldProps {
  label: string
  value: string | number
  editable: boolean
  onChange?: (value: string) => void
  format?: 'currency' | 'text'
}

function ReviewField({ label, value, editable, onChange, format = 'text' }: ReviewFieldProps) {
  const displayValue = format === 'currency'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value))
    : value

  return (
    <div>
      <label className="block text-xs uppercase tracking-wider font-medium text-slate-500 mb-1">
        {label}
      </label>
      {editable && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      ) : (
        <p className="text-lg font-medium text-white">{displayValue}</p>
      )}
    </div>
  )
}

