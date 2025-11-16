import {PrismaClient} from '@prisma/client';
import type {
  LoanApplication,
  BorrowerProfile,
  DocumentMetadata,
  UnderwritingCondition,
} from '@shared-types';

const prisma = new PrismaClient();

export class LoanDatabase {
  // Borrower operations
  async createBorrower(borrower: BorrowerProfile): Promise<BorrowerProfile> {
    const created = await prisma.borrower.create({
      data: {
        id: borrower.id,
        firstName: borrower.firstName,
        lastName: borrower.lastName,
        email: borrower.email,
        phone: borrower.phone,
        dateOfBirth: borrower.dateOfBirth,
      },
    });

    return {
      id: created.id,
      firstName: created.firstName,
      lastName: created.lastName,
      email: created.email,
      phone: created.phone || undefined,
      dateOfBirth: created.dateOfBirth || undefined,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async getBorrower(id: string): Promise<BorrowerProfile | null> {
    const borrower = await prisma.borrower.findUnique({
      where: {id},
    });

    if (!borrower) return null;

    return {
      id: borrower.id,
      firstName: borrower.firstName,
      lastName: borrower.lastName,
      email: borrower.email,
      phone: borrower.phone || undefined,
      dateOfBirth: borrower.dateOfBirth || undefined,
      createdAt: borrower.createdAt.toISOString(),
      updatedAt: borrower.updatedAt.toISOString(),
    };
  }

  // Loan operations
  async createLoan(loan: LoanApplication): Promise<LoanApplication> {
    // Create borrower if doesn't exist
    await prisma.borrower.upsert({
      where: {id: loan.borrower.id},
      create: {
        id: loan.borrower.id,
        firstName: loan.borrower.firstName,
        lastName: loan.borrower.lastName,
        email: loan.borrower.email,
        phone: loan.borrower.phone,
        dateOfBirth: loan.borrower.dateOfBirth,
      },
      update: {
        firstName: loan.borrower.firstName,
        lastName: loan.borrower.lastName,
        email: loan.borrower.email,
        phone: loan.borrower.phone,
        dateOfBirth: loan.borrower.dateOfBirth,
      },
    });

    const created = await prisma.loanApplication.create({
      data: {
        id: loan.id,
        borrowerId: loan.borrowerId,
        loanOfficerId: loan.loanOfficerId,
        status: loan.status,
        stage: loan.stage,
        propertyStreet: loan.property.address.street,
        propertyCity: loan.property.address.city,
        propertyState: loan.property.address.state,
        propertyZipCode: loan.property.address.zipCode,
        propertyType: loan.property.propertyType,
        purchasePrice: loan.property.purchasePrice,
        downPayment: loan.property.downPayment,
        loanAmount: loan.loanAmount,
        employmentStatus: loan.employment.status,
        employerName: loan.employment.employerName,
        jobTitle: loan.employment.jobTitle,
        monthlyIncome: loan.employment.monthlyIncome,
        incomeType: loan.employment.incomeType,
        loanType: loan.loanType,
        loanPurpose: loan.loanPurpose,
        interestRate: loan.interestRate,
        loanTerm: loan.loanTerm,
        debtToIncomeRatio: loan.debtToIncomeRatio,
        loanToValueRatio: loan.loanToValueRatio,
        underwritingDecision: loan.underwritingDecision,
        underwritingNotes: loan.underwritingNotes,
        submittedAt: loan.submittedAt ? new Date(loan.submittedAt) : null,
        approvedAt: loan.approvedAt ? new Date(loan.approvedAt) : null,
        closedAt: loan.closedAt ? new Date(loan.closedAt) : null,
      },
      include: {
        borrower: true,
        documents: true,
        conditions: true,
      },
    });

    return this.mapToLoanApplication(created);
  }

  async getLoan(id: string): Promise<LoanApplication | null> {
    const loan = await prisma.loanApplication.findUnique({
      where: {id},
      include: {
        borrower: true,
        documents: true,
        conditions: true,
      },
    });

    if (!loan) return null;

    return this.mapToLoanApplication(loan);
  }

  async updateLoan(
    id: string,
    updates: Partial<LoanApplication>,
  ): Promise<LoanApplication> {
    const updated = await prisma.loanApplication.update({
      where: {id},
      data: {
        status: updates.status,
        stage: updates.stage,
        debtToIncomeRatio: updates.debtToIncomeRatio,
        loanToValueRatio: updates.loanToValueRatio,
        underwritingDecision: updates.underwritingDecision,
        underwritingNotes: updates.underwritingNotes,
        submittedAt: updates.submittedAt
          ? new Date(updates.submittedAt)
          : undefined,
        approvedAt: updates.approvedAt ? new Date(updates.approvedAt) : undefined,
        closedAt: updates.closedAt ? new Date(updates.closedAt) : undefined,
      },
      include: {
        borrower: true,
        documents: true,
        conditions: true,
      },
    });

    return this.mapToLoanApplication(updated);
  }

  async listLoans(filters: {
    borrowerId?: string;
    status?: string;
    stage?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    items: LoanApplication[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;

    const where: any = {};
    if (filters.borrowerId) where.borrowerId = filters.borrowerId;
    if (filters.status) where.status = filters.status;
    if (filters.stage) where.stage = filters.stage;

    const [loans, total] = await Promise.all([
      prisma.loanApplication.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          borrower: true,
          documents: true,
          conditions: true,
        },
        orderBy: {createdAt: 'desc'},
      }),
      prisma.loanApplication.count({where}),
    ]);

    return {
      items: loans.map(loan => this.mapToLoanApplication(loan)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getLoansReadyForSignOff(): Promise<LoanApplication[]> {
    const loans = await prisma.loanApplication.findMany({
      where: {stage: 'ClearToClose'},
      include: {
        borrower: true,
        documents: true,
        conditions: true,
      },
    });

    return loans.map(loan => this.mapToLoanApplication(loan));
  }

  private mapToLoanApplication(loan: any): LoanApplication {
    return {
      id: loan.id,
      borrowerId: loan.borrowerId,
      loanOfficerId: loan.loanOfficerId,
      status: loan.status as any,
      stage: loan.stage as any,
      borrower: {
        id: loan.borrower.id,
        firstName: loan.borrower.firstName,
        lastName: loan.borrower.lastName,
        email: loan.borrower.email,
        phone: loan.borrower.phone || undefined,
        dateOfBirth: loan.borrower.dateOfBirth || undefined,
        createdAt: loan.borrower.createdAt.toISOString(),
        updatedAt: loan.borrower.updatedAt.toISOString(),
      },
      property: {
        address: {
          street: loan.propertyStreet,
          city: loan.propertyCity,
          state: loan.propertyState,
          zipCode: loan.propertyZipCode,
        },
        propertyType: loan.propertyType as any,
        purchasePrice: loan.purchasePrice,
        downPayment: loan.downPayment,
        loanAmount: loan.loanAmount,
      },
      employment: {
        status: loan.employmentStatus as any,
        employerName: loan.employerName || undefined,
        jobTitle: loan.jobTitle || undefined,
        monthlyIncome: loan.monthlyIncome || undefined,
        incomeType: loan.incomeType as any,
      },
      assets: [], // TODO: Add assets table
      debts: [], // TODO: Add debts table
      documents: loan.documents.map((doc: any) => ({
        id: doc.id,
        loanId: doc.loanId,
        type: doc.type as any,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        uploadedAt: doc.uploadedAt.toISOString(),
        uploadedBy: doc.uploadedBy,
        storagePath: doc.storagePath,
        extractedData: doc.extractedData,
        verificationStatus: doc.verificationStatus as any,
        verifiedBy: doc.verifiedBy || undefined,
        verifiedAt: doc.verifiedAt?.toISOString() || undefined,
      })),
      loanType: loan.loanType as any,
      loanPurpose: loan.loanPurpose as any,
      interestRate: loan.interestRate || undefined,
      loanTerm: loan.loanTerm,
      debtToIncomeRatio: loan.debtToIncomeRatio || undefined,
      loanToValueRatio: loan.loanToValueRatio || undefined,
      underwritingDecision: loan.underwritingDecision as any,
      underwritingConditions: loan.conditions.map((cond: any) => ({
        id: cond.id,
        loanId: cond.loanId,
        type: cond.type as any,
        description: cond.description,
        status: cond.status as any,
        satisfiedAt: cond.satisfiedAt?.toISOString() || undefined,
        satisfiedBy: cond.satisfiedBy || undefined,
        waivedAt: cond.waivedAt?.toISOString() || undefined,
        waivedBy: cond.waivedBy || undefined,
        createdAt: cond.createdAt.toISOString(),
      })),
      underwritingNotes: loan.underwritingNotes || undefined,
      createdAt: loan.createdAt.toISOString(),
      updatedAt: loan.updatedAt.toISOString(),
      submittedAt: loan.submittedAt?.toISOString() || undefined,
      approvedAt: loan.approvedAt?.toISOString() || undefined,
      closedAt: loan.closedAt?.toISOString() || undefined,
    };
  }
}

export const loanDb = new LoanDatabase();

