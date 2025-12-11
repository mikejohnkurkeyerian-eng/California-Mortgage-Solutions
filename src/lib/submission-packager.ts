import JSZip from 'jszip';
import { LoanApplication } from '@/types/shared';
import { MismoGenerator } from './mismo-generator';

export class SubmissionPackager {
    static async createPackage(loan: LoanApplication): Promise<string> {
        const zip = new JSZip();

        // 1. Generate MISMO XML
        const mismoXml = MismoGenerator.generate(loan);
        zip.file(`loan_${loan.id}_mismo_3.4.xml`, mismoXml);

        // 2. Add Documents (Mocked for now as we don't have file storage access in this scope)
        // In production, we would fetch parsing URLs or Streams.
        const docsFolder = zip.folder('documents');

        if (loan.documents && loan.documents.length > 0) {
            for (const doc of loan.documents) {
                // Mock content: creating a simple text file instead of real PDF content
                // Real implementation would fetch validation URL content
                docsFolder?.file(`${doc.type}_${doc.id}.txt`, `This is a placeholder for document ${doc.id} of type ${doc.type}. In a real application, this would be the actual PDF content.`);
            }
        } else {
            docsFolder?.file('readme.txt', 'No documents were attached to this loan.');
        }

        // 3. Generate Async
        const content = await zip.generateAsync({ type: 'base64' });
        return content;
    }
}

