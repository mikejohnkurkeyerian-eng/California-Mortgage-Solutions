import { LoanApplication, DocumentMetadata } from '@/types/shared'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useState } from 'react'
import { DocumentViewerModal } from '@/components/documents/DocumentViewerModal'

interface LoanDocumentsProps {
  loan: LoanApplication
}

export function LoanDocuments({ loan }: LoanDocumentsProps) {
  // Guard against undefined documents
  const documents = loan.documents || [];
  const [viewingDoc, setViewingDoc] = useState<DocumentMetadata | null>(null);

  // Helper to open viewer
  const handleView = (doc: any) => {
    // Ensure doc matches DocumentMetadata structure for viewer
    const docMetadata: DocumentMetadata = {
      ...doc,
      id: doc.id || 'temp-id',
      storagePath: doc.storagePath || 'mock/path' // Fallback for legacy data
    };
    setViewingDoc(docMetadata);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Documents</h3>
          <Link href={`/broker/loans/${loan.id}/documents`}>
            <Button variant="outline" size="sm">Manage Documents</Button>
          </Link>
        </div>

        <div className="p-6">
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-slate-500 mb-4">No documents uploaded yet.</p>
              <Link href={`/broker/loans/${loan.id}/documents`}>
                <Button variant="secondary">View Requirements</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white truncate max-w-[150px]">{doc.fileName}</p>
                      <p className="text-xs text-slate-500">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-slate-500 hover:text-primary-500"
                      onClick={() => handleView(doc)}
                      title="View Document"
                    >
                      <span className="mr-1">👁️</span> View
                    </Button>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${doc.verificationStatus === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {doc.verificationStatus}
                    </span>
                  </div>
                </div>
              ))}
              {documents.length > 3 && (
                <div className="text-center pt-2">
                  <Link href={`/broker/loans/${loan.id}/documents`} className="text-sm text-blue-600 hover:underline">
                    + {documents.length - 3} more
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        document={viewingDoc!}
      />
    </>
  )
}


