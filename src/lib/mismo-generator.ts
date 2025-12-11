import { LoanApplication } from '@loan-platform/shared-types';

export class MismoGenerator {
    static generate(loan: LoanApplication): string {
        const now = new Date().toISOString();
        // Uses the loan data to construct a valid MISMO 3.4 XML string
        return `<?xml version="1.0" encoding="UTF-8"?>
<MESSAGE MISMOVersionID="3.4.0">
    <ABOUT_VERSIONS>
        <ABOUT_VERSION CreatedDatetime="${now}">
            <CreatedByApplication>
                <ApplicationName>LoanPlatform</ApplicationName>
                <ApplicationVersionIdentifier>1.0.0</ApplicationVersionIdentifier>
            </CreatedByApplication>
        </ABOUT_VERSION>
    </ABOUT_VERSIONS>
    <DEAL_SETS>
        <DEAL_SET>
            <DEALS>
                <DEAL>
                    <ASSETS>
                        ${(loan.assets || []).map(asset => `
                        <ASSET>
                            <ASSET_DETAIL>
                                <AssetAccountIdentifier>${asset.accountNumber || 'N/A'}</AssetAccountIdentifier>
                                <AssetCashOrMarketValueAmount>${asset.currentBalance}</AssetCashOrMarketValueAmount>
                                <AssetType>${this.mapAssetType(asset.type)}</AssetType>
                            </ASSET_DETAIL>
                        </ASSET>`).join('')}
                    </ASSETS>
                    <COLLATERALS>
                        <COLLATERAL>
                            <SUBJECT_PROPERTY>
                                <ADDRESS>
                                    <AddressLineText>${loan.property?.address?.street || ''}</AddressLineText>
                                    <CityName>${loan.property?.address?.city || ''}</CityName>
                                    <PostalCode>${loan.property?.address?.zipCode || ''}</PostalCode>
                                    <StateCode>${loan.property?.address?.state || ''}</StateCode>
                                </ADDRESS>
                                <PROPERTY_DETAIL>
                                    <PropertyEstimatedValueAmount>${loan.property?.purchasePrice || 0}</PropertyEstimatedValueAmount>
                                    <PropertyUsageType>PrimaryResidence</PropertyUsageType>
                                </PROPERTY_DETAIL>
                            </SUBJECT_PROPERTY>
                        </COLLATERAL>
                    </COLLATERALS>
                    <LIABILITIES>
                        ${(loan.debts || []).map(debt => `
                        <LIABILITY>
                            <LIABILITY_DETAIL>
                                <LiabilityAccountIdentifier>${debt.accountNumber || 'N/A'}</LiabilityAccountIdentifier>
                                <LiabilityMonthlyPaymentAmount>${debt.monthlyPayment}</LiabilityMonthlyPaymentAmount>
                                <LiabilityUnpaidBalanceAmount>${debt.currentBalance}</LiabilityUnpaidBalanceAmount>
                                <LiabilityType>${this.mapLiabilityType(debt.type)}</LiabilityType>
                            </LIABILITY_DETAIL>
                        </LIABILITY>`).join('')}
                    </LIABILITIES>
                    <LOANS>
                        <LOAN LoanRoleType="SubjectLoan">
                            <LOAN_DETAIL>
                                <BaseLoanAmount>${loan.property?.loanAmount || 0}</BaseLoanAmount>
                                <InterestRatePercent>${loan.interestRate || 0}</InterestRatePercent>
                                <LoanAmortizationPeriodCount>${loan.loanTerm || 360}</LoanAmortizationPeriodCount>
                                <LoanAmortizationType>Fixed</LoanAmortizationType>
                                <LoanPurposeType>${this.mapLoanPurpose(loan.loanPurpose)}</LoanPurposeType>
                            </LOAN_DETAIL>
                        </LOAN>
                    </LOANS>
                    <PARTIES>
                        <PARTY>
                            <INDIVIDUAL>
                                <NAME>
                                    <FirstName>${loan.borrower?.firstName || ''}</FirstName>
                                    <LastName>${loan.borrower?.lastName || ''}</LastName>
                                </NAME>
                                <CONTACT_POINTS>
                                    <CONTACT_POINT>
                                        <CONTACT_POINT_EMAIL>
                                            <ContactPointEmailValue>${loan.borrower?.email || ''}</ContactPointEmailValue>
                                        </CONTACT_POINT_EMAIL>
                                    </CONTACT_POINT>
                                </CONTACT_POINTS>
                            </INDIVIDUAL>
                            <ROLES>
                                <ROLE RoleType="Borrower">
                                    <BORROWER>
                                        <BORROWER_DETAIL>
                                            <BorrowerBirthDate>${loan.borrower?.dateOfBirth || '1980-01-01'}</BorrowerBirthDate>
                                        </BORROWER_DETAIL>
                                        <EMPLOYMENT>
                                            <EMPLOYMENT_DETAIL>
                                                <EmploymentMonthlyIncomeAmount>${loan.employment?.monthlyIncome || 0}</EmploymentMonthlyIncomeAmount>
                                                <EmploymentStatusType>Current</EmploymentStatusType>
                                            </EMPLOYMENT_DETAIL>
                                        </EMPLOYMENT>
                                    </BORROWER>
                                </ROLE>
                            </ROLES>
                        </PARTY>
                    </PARTIES>
                </DEAL>
            </DEALS>
        </DEAL_SET>
    </DEAL_SETS>
</MESSAGE>`;
    }

    private static mapAssetType(type: string): string {
        const map: Record<string, string> = {
            'Checking': 'CheckingAccount',
            'Savings': 'SavingsAccount',
            'Investment': 'Stock',
            'Retirement': 'RetirementFund'
        };
        return map[type] || 'Other';
    }

    private static mapLiabilityType(type: string): string {
        const map: Record<string, string> = {
            'CreditCard': 'CreditCard',
            'AutoLoan': 'Installment',
            'StudentLoan': 'Installment',
            'Mortgage': 'MortgageLoan'
        };
        return map[type] || 'Other';
    }

    private static mapLoanPurpose(purpose: string): string {
        const map: Record<string, string> = {
            'Purchase': 'Purchase',
            'Refinance': 'Refinance',
            'CashOutRefinance': 'CashOutRefinance'
        };
        return map[purpose] || 'Purchase';
    }
}
