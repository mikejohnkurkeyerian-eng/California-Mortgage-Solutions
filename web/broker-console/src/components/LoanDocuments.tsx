import { LoanApplication } from '@/types/shared'

interface LoanDocumentsProps {
  loan: LoanApplication
}

export function LoanDocuments({ loan }: LoanDocumentsProps) {
  if (loan.documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No documents uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents ({loan.documents.length})</h3>
      <div className="grid grid-cols-1 gap-4">
        {loan.documents.map((doc) => (
          <div
            key={doc.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📄</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.fileName}</h4>
                    <p className="text-sm text-gray-500">{doc.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 ml-11">
                  <span>{(doc.fileSize / 1024).toFixed(2)} KB</span>
                  <span>•</span>
                  <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    doc.verificationStatus === 'Verified'
                      ? 'bg-green-100 text-green-800'
                      : doc.verificationStatus === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : doc.verificationStatus === 'NeedsReview'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {doc.verificationStatus}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


