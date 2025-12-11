/*
  Warnings:

  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Borrower` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Liability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Loan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_loanId_fkey";

-- DropForeignKey
ALTER TABLE "Borrower" DROP CONSTRAINT "Borrower_loanId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_loanId_fkey";

-- DropForeignKey
ALTER TABLE "Liability" DROP CONSTRAINT "Liability_loanId_fkey";

-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_userId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_loanId_fkey";

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "brokerId" TEXT,
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "Asset";

-- DropTable
DROP TABLE "Borrower";

-- DropTable
DROP TABLE "Liability";

-- DropTable
DROP TABLE "Loan";

-- CreateTable
CREATE TABLE "LoanApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brokerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "stage" TEXT NOT NULL DEFAULT 'Application Review',
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "LoanApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "LoanApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
