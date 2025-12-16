import axios from 'axios'
import type { LoanApplication } from '@/types/shared'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4002'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface LenderConfig {
  id?: string
  lenderName: string
  lenderId: string
  apiBaseUrl: string
  apiKey: string
  apiSecret: string
  ausProvider: 'DU' | 'LP' | 'Other'
  ausApiKey?: string
  ausApiSecret?: string
  creditBureauProvider: 'Experian' | 'Equifax' | 'TransUnion' | 'TriMerge'
  creditBureauApiKey?: string
  creditBureauApiSecret?: string
  voeProvider?: string
  voeApiKey?: string
  pricingEngineProvider?: string
  pricingEngineApiKey?: string
  enabled?: boolean
  // Lender-specific criteria
  minCreditScore?: number
  maxLoanToValue?: number
  maxDebtToIncome?: number
  loanTypes?: string[] // ["Conventional", "FHA", "VA", etc.]
}

export interface LenderComparison {
  lender: LenderConfig
  rate: {
    rate: number
    apr: number
    points: number
    fees: number
    estimatedMonthlyPayment: number
  } | null
  approvalProbability: {
    probability: number
    reasons: string[]
    riskFactors: string[]
  }
  score: number
  recommended: boolean
}

// Get all lender configurations
export async function getLenderConfigs(): Promise<LenderConfig[]> {
  try {
    const response = await apiClient.get('/api/lender-config')
    return response.data.data?.lenders || []
  } catch (error) {
    // If no config exists, return empty array (not an error)
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return []
    }
    throw error
  }
}

// Save lender configuration (add or update)
export async function saveLenderConfig(config: LenderConfig): Promise<LenderConfig> {
  const response = await apiClient.post('/api/lender-config', config)
  return response.data.data?.lender || response.data.data?.config
}

// Delete a lender
export async function deleteLender(lenderId: string): Promise<void> {
  await apiClient.delete(`/api/lender-config/${lenderId}`)
}

// Compare lenders for a loan and get AI recommendation
export async function compareLenders(loanId: string): Promise<{
  comparisons: LenderComparison[]
  recommended: LenderComparison | null
}> {
  const response = await apiClient.post(`/api/applications/${loanId}/compare-lenders`)
  return response.data.data
}

// Get recommended lender for a loan
export async function getRecommendedLender(loanId: string): Promise<{
  recommended: LenderComparison | null
  allComparisons: LenderComparison[]
}> {
  const response = await apiClient.get(`/api/applications/${loanId}/recommended-lender`)
  return response.data.data
}

// Test lender API connection
export async function testLenderConnection(): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post('/api/lender-config/test-connection')
  return response.data.data
}


