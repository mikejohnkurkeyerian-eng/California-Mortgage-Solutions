import { Router } from "express";
import multer from "multer";
import axios from "axios";
import type { DocumentMetadata, ApiResponse } from "@shared-types";

const WORKFLOW_SERVICE_URL = process.env.WORKFLOW_SERVICE_URL || "http://localhost:4004";

// Helper function to trigger workflow on document upload
async function triggerWorkflowOnDocumentUpload(loanId: string, documentId: string): Promise<void> {
  try {
    await axios.post(`${WORKFLOW_SERVICE_URL}/api/events/document-uploaded`, {
      loanId,
      documentId,
    });
  } catch (error) {
    // Log error but don't fail the request
    console.error(`Failed to trigger workflow for document ${documentId}:`, error);
  }
}

const router = Router();

// Configure multer for file uploads (in production, use S3 or similar)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// In-memory store for demo (replace with database + S3 in production)
const documents: Map<string, DocumentMetadata> = new Map();

// Upload document
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NO_FILE",
          message: "No file provided",
        },
      };
      return res.status(400).json(response);
    }

    const { loanId, documentType } = req.body;

    if (!loanId || !documentType) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "MISSING_PARAMS",
          message: "loanId and documentType are required",
        },
      };
      return res.status(400).json(response);
    }

    // Create document metadata
    const document: DocumentMetadata = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      loanId,
      type: documentType as DocumentMetadata["type"],
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      uploadedBy: req.body.userId || "system",
      storagePath: `uploads/${loanId}/${req.file.originalname}`, // In production, use S3 path
      verificationStatus: "Pending",
    };

    documents.set(document.id, document);

    // Trigger workflow to check if documents are complete
    triggerWorkflowOnDocumentUpload(loanId, document.id).catch(console.error);

    // AI classification will happen on submit, not during upload

    const response: ApiResponse<DocumentMetadata> = {
      success: true,
      data: document,
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "UPLOAD_FAILED",
        message: error instanceof Error ? error.message : "Failed to upload document",
      },
    };
    res.status(500).json(response);
  }
});

// Get document by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const document = documents.get(id);

    if (!document) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Document not found",
        },
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<DocumentMetadata> = {
      success: true,
      data: document,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: error instanceof Error ? error.message : "Failed to fetch document",
      },
    };
    res.status(500).json(response);
  }
});

// Get all documents for a loan
router.get("/loan/:loanId", async (req, res) => {
  try {
    const { loanId } = req.params;
    const loanDocuments = Array.from(documents.values()).filter(
      (doc) => doc.loanId === loanId
    );

    const response: ApiResponse<DocumentMetadata[]> = {
      success: true,
      data: loanDocuments,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "FETCH_FAILED",
        message: error instanceof Error ? error.message : "Failed to fetch documents",
      },
    };
    res.status(500).json(response);
  }
});

// AI Document Classification - Classify documents by analyzing their content
async function classifyDocument(fileName: string, fileContent: Buffer): Promise<DocumentMetadata["type"]> {
  // Simulate AI classification based on filename patterns and content analysis
  // In production, this would use AWS Textract, Google Document AI, or custom ML models
  
  const fileNameLower = fileName.toLowerCase();
  
  // Classification rules based on filename patterns
  if (fileNameLower.includes('driver') || fileNameLower.includes('license') || fileNameLower.includes('id')) {
    return 'DriverLicense';
  }
  if (fileNameLower.includes('w2') || fileNameLower.includes('w-2')) {
    return 'W2';
  }
  if (fileNameLower.includes('pay') && (fileNameLower.includes('stub') || fileNameLower.includes('statement'))) {
    return 'PayStub';
  }
  if (fileNameLower.includes('tax') || fileNameLower.includes('1040') || fileNameLower.includes('return')) {
    return 'TaxReturn';
  }
  if (fileNameLower.includes('bank') || fileNameLower.includes('statement') || fileNameLower.includes('account')) {
    return 'BankStatement';
  }
  if (fileNameLower.includes('purchase') || fileNameLower.includes('agreement') || fileNameLower.includes('contract')) {
    return 'PurchaseAgreement';
  }
  if (fileNameLower.includes('insurance') || fileNameLower.includes('homeowner')) {
    return 'HomeownersInsurance';
  }
  if (fileNameLower.includes('business') && fileNameLower.includes('tax')) {
    return 'BusinessTaxReturn';
  }
  if (fileNameLower.includes('profit') || fileNameLower.includes('loss') || fileNameLower.includes('p&l')) {
    return 'ProfitLossStatement';
  }
  if (fileNameLower.includes('social') || fileNameLower.includes('security')) {
    return 'Other';
  }
  if (fileNameLower.includes('pension')) {
    return 'Other';
  }
  if (fileNameLower.includes('retirement') || fileNameLower.includes('401k') || fileNameLower.includes('ira')) {
    return 'RetirementStatement';
  }
  if (fileNameLower.includes('investment')) {
    return 'InvestmentStatement';
  }
  if (fileNameLower.includes('hoa')) {
    return 'HOADocuments';
  }
  if (fileNameLower.includes('gift')) {
    return 'GiftLetter';
  }
  
  // Default to Other if we can't classify
  return 'Other';
}

// Submit and classify uploaded documents
router.post("/loan/:loanId/classify", async (req, res) => {
  try {
    const { loanId } = req.params;
    
    // Get all unclassified documents for this loan
    const loanDocuments = Array.from(documents.values()).filter(
      (doc) => doc.loanId === loanId && doc.type === 'Other'
    );

    if (loanDocuments.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NO_DOCUMENTS",
          message: "No documents to classify",
        },
      };
      return res.status(400).json(response);
    }

    // Classify each document
    const classifiedDocuments: DocumentMetadata[] = [];
    for (const doc of loanDocuments) {
      // In production, we would read the actual file content
      // For now, we'll classify based on filename
      const classifiedType = await classifyDocument(doc.fileName, Buffer.from(''));
      
      doc.type = classifiedType;
      doc.verificationStatus = 'Pending';
      documents.set(doc.id, doc);
      classifiedDocuments.push(doc);
    }

    // Update loan application with classified documents
    try {
      const LOAN_SERVICE_URL = process.env.LOAN_SERVICE_URL || "http://localhost:4002";
      await axios.post(`${LOAN_SERVICE_URL}/api/applications/${loanId}/documents`, {
        documents: classifiedDocuments, // Send full DocumentMetadata objects
      });
    } catch (error) {
      console.error('Failed to update loan with documents:', error);
      // Continue anyway - documents are still classified
    }

    const response: ApiResponse<DocumentMetadata[]> = {
      success: true,
      data: classifiedDocuments,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "CLASSIFY_FAILED",
        message: error instanceof Error ? error.message : "Failed to classify documents",
      },
    };
    res.status(500).json(response);
  }
});

// Verify document
router.post("/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, verifiedBy } = req.body;

    const document = documents.get(id);

    if (!document) {
      const response: ApiResponse<never> = {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Document not found",
        },
      };
      return res.status(404).json(response);
    }

    document.verificationStatus = status;
    document.verifiedBy = verifiedBy;
    document.verifiedAt = new Date().toISOString();

    documents.set(id, document);

    const response: ApiResponse<DocumentMetadata> = {
      success: true,
      data: document,
    };

    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "VERIFY_FAILED",
        message: error instanceof Error ? error.message : "Failed to verify document",
      },
    };
    res.status(500).json(response);
  }
});

export default router;

