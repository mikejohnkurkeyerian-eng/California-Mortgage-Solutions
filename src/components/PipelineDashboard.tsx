'use client'

import { useQuery } from '@tanstack/react-query'
import { LoanApplication, LoanStage } from '@shared-types'
import { LoanCard } from './LoanCard'
import { getLoans } from '@/lib/api'
import { useState } from 'react'

export function PipelineDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pipeline Dashboard</h1>
      <p>Dashboard temporarily disabled for debugging.</p>
    </div>
  )
}
