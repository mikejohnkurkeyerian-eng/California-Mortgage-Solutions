import { determineRequiredDocuments, LoanApplication } from './src/lib/document-requirements';

const mockW2Loan: LoanApplication = {
    id: '1', borrowerId: 'b1', status: 'Draft',
    borrower: { id: 'b1', firstName: 'John', lastName: 'Doe', email: 'j@d.com', phone: '123' },
    employment: { incomeType: 'W2', monthlyIncome: 5000 },
    assets: [{ type: 'Checking', value: 10000 }],
    property: { address: { street: '123 Main', city: 'Anytown', state: 'CA', zipCode: '90210' }, propertyType: 'SingleFamily', purchasePrice: 500000, loanAmount: 400000 },
    full1003: {
        employment: [{
            isSelfEmployed: false,
            employerName: 'Acme',
            monthlyIncome: { base: 5000, total: 5000 },
            yearsOnJob: 2,
            monthsOnJob: 0,
            position: 'Manager',
            employedByFamilyMember: false,
            employedByPartyToTransaction: false,
            ownershipShare: 0
        }],
        assets: [{ type: 'Checking', cashOrMarketValue: 10000, institutionName: 'Bank', accountNumber: '1234' }],
        loanAndProperty: {
            loanPurpose: 'Purchase',
            loanAmount: 400000,
            propertyValue: 500000,
            occupancy: 'PrimaryResidence',
            address: { street: '123 Main', city: 'Anytown', state: 'CA', zip: '90210' },
            isMixedUse: false,
            isManufacturedHome: false
        },
        borrower: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'j@d.com',
            phone: '123',
            dob: '1980-01-01',
            ssn: '123',
            maritalStatus: 'Married',
            dependentsCount: 0,
            citizenship: 'USCitizen',
            applicationType: 'Individual'
        },
        currentAddress: { street: '123 Main', city: 'Anytown', state: 'CA', zip: '90210', housingStatus: 'Own', yearsAtAddress: 5, monthsAtAddress: 0 },
        liabilities: [],
        realEstate: [],
        declarations: {
            a_primaryResidence: true,
            b_familyRelationship: false,
            c_borrowingMoney: false,
            d_otherMortgages: false,
            e_newCredit: false,
            f_priorityLien: false,
            g_coSigner: false,
            h_outstandingJudgments: false,
            i_delinquentFederalDebt: false,
            j_lawsuit: false,
            k_foreclosure: false,
            l_bankruptcy: false
        },
        demographics: {
            ethnicity: 'NotHispanicOrLatino',
            sex: 'Male',
            race: {
                white: true,
                americanIndianOrAlaskaNative: false,
                asian: false,
                blackOrAfricanAmerican: false,
                nativeHawaiianOrOtherPacificIslander: false,
                refuse: false
            }
        },
        military: { isVeteran: false, isActiveDuty: false, isSurvivingSpouse: false },
        acknowledgments: { agreedToElectronicSignatures: true, dateSigned: '2023-01-01' }
    }
};

const mockSelfEmployedLoan: LoanApplication = {
    ...mockW2Loan,
    employment: { incomeType: 'SelfEmployed', monthlyIncome: 8000 },
    full1003: {
        ...mockW2Loan.full1003!,
        employment: [{
            isSelfEmployed: true,
            employerName: 'MyBiz',
            monthlyIncome: { base: 8000, total: 8000 },
            yearsOnJob: 5,
            monthsOnJob: 0,
            position: 'Owner',
            employedByFamilyMember: false,
            employedByPartyToTransaction: false,
            ownershipShare: 100
        }],
        assets: [{ type: 'Checking', cashOrMarketValue: 20000, institutionName: 'Bank', accountNumber: '5678' }],
        loanAndProperty: {
            loanPurpose: 'Refinance',
            loanAmount: 400000,
            propertyValue: 500000,
            occupancy: 'PrimaryResidence',
            address: { street: '123 Main', city: 'Anytown', state: 'CA', zip: '90210' },
            isMixedUse: false,
            isManufacturedHome: false
        },
        realEstate: [{
            status: 'Retained',
            address: { street: '123 Main', city: 'Anytown', state: 'CA', zip: '90210' },
            propertyValue: 500000,
            intendedOccupancy: 'Primary',
            mortgageLoans: [],
            monthlyInsuranceTaxesHOA: 0,
            monthlyRentalIncome: 0
        }]
    }
};

console.log("--- W2 SCENARIO ---");
const w2Docs = determineRequiredDocuments(mockW2Loan);
console.log(w2Docs.map(d => d.name));

console.log("\n--- SELF-EMPLOYED SCENARIO ---");
const seDocs = determineRequiredDocuments(mockSelfEmployedLoan);
console.log(seDocs.map(d => d.name));
