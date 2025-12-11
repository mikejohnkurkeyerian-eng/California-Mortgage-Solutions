'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLenderConfigs, saveLenderConfig, deleteLender, type LenderConfig } from '@/lib/lender-api'

export function LenderManagement() {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const queryClient = useQueryClient()

  const { data: lenders = [], isLoading } = useQuery({
    queryKey: ['lender-configs'],
    queryFn: getLenderConfigs,
    retry: false,
  })

  const saveMutation = useMutation({
    mutationFn: saveLenderConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lender-configs'] })
      setIsAdding(false)
      setEditingId(null)
      alert('Lender saved successfully!')
    },
    onError: (error: any) => {
      alert(`Error saving lender: ${error.message}`)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLender,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lender-configs'] })
      alert('Lender deleted successfully!')
    },
    onError: (error: any) => {
      alert(`Error deleting lender: ${error.message}`)
    },
  })

  const [formData, setFormData] = useState<LenderConfig>({
    lenderName: '',
    lenderId: '',
    apiBaseUrl: '',
    apiKey: '',
    apiSecret: '',
    ausProvider: 'DU',
    creditBureauProvider: 'TriMerge',
    enabled: true,
    minCreditScore: undefined,
    maxLoanToValue: undefined,
    maxDebtToIncome: undefined,
    loanTypes: ['Conventional'],
  })

  const handleEdit = (lender: LenderConfig) => {
    setFormData(lender)
    setEditingId(lender.id || null)
    setIsAdding(false)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      lenderName: '',
      lenderId: '',
      apiBaseUrl: '',
      apiKey: '',
      apiSecret: '',
      ausProvider: 'DU',
      creditBureauProvider: 'TriMerge',
      enabled: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate(formData)
  }

  const handleDelete = (lenderId: string) => {
    if (window.confirm('Are you sure you want to delete this lender?')) {
      deleteMutation.mutate(lenderId)
    }
  }

  const toggleApiKey = (lenderId: string) => {
    setShowApiKey((prev) => ({ ...prev, [lenderId]: !prev[lenderId] }))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading lenders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lender Management</h1>
            <p className="text-gray-600">
              Configure multiple lenders. AI will automatically select the best lender based on rates and approval likelihood.
            </p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true)
              setEditingId(null)
              setFormData({
                lenderName: '',
                lenderId: '',
                apiBaseUrl: '',
                apiKey: '',
                apiSecret: '',
                ausProvider: 'DU',
                creditBureauProvider: 'TriMerge',
                enabled: true,
              })
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            + Add Lender
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Lender' : 'Add New Lender'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lender Name *
                </label>
                <input
                  type="text"
                  value={formData.lenderName}
                  onChange={(e) => setFormData({ ...formData, lenderName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lender ID *
                </label>
                <input
                  type="text"
                  value={formData.lenderId}
                  onChange={(e) => setFormData({ ...formData, lenderId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Base URL *
                </label>
                <input
                  type="url"
                  value={formData.apiBaseUrl}
                  onChange={(e) => setFormData({ ...formData, apiBaseUrl: e.target.value })}
                  required
                  placeholder="https://api.lender.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key *
                </label>
                <input
                  type={showApiKey[editingId || 'new'] ? 'text' : 'password'}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Secret *
                </label>
                <input
                  type="password"
                  value={formData.apiSecret}
                  onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled !== false}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                Enabled (lender will be included in AI selection)
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Saving...' : editingId ? 'Update Lender' : 'Add Lender'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lenders List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Configured Lenders ({lenders.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI will automatically compare all enabled lenders and select the best one for each loan
          </p>
        </div>

        {lenders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 mb-4">No lenders configured yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Your First Lender
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {lenders.map((lender: LenderConfig) => (
              <div
                key={lender.id || lender.lenderId}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{lender.lenderName}</h3>
                      {lender.enabled ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          Enabled
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Lender ID:</span> {lender.lenderId}
                      </div>
                      <div>
                        <span className="font-medium">AUS Provider:</span> {lender.ausProvider}
                      </div>
                      <div>
                        <span className="font-medium">Credit Bureau:</span> {lender.creditBureauProvider}
                      </div>
                      <div>
                        <span className="font-medium">API URL:</span> {lender.apiBaseUrl}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(lender)}
                      className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lender.id || lender.lenderId)}
                      className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


