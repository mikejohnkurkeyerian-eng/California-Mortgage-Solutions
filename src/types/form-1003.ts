export interface Address {
    street: string;
    unit?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
}

export interface AddressHistory extends Address {
    housingStatus: 'Own' | 'Rent' | 'LivingRentFree';
    monthlyRent?: number;
    yearsAtAddress: number;
    monthsAtAddress: number;
}

export interface BorrowerPersonal {
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    email: string;
    phone: string;
    workPhone?: string;
    homePhone?: string;
    maritalStatus: 'Married' | 'Separated' | 'Unmarried';
    dependentsCount: number;
    dependentsAges?: string;
    dob: string; // YYYY-MM-DD
    citizenship: 'USCitizen' | 'PermanentResident' | 'NonPermanentResident';
    ssn: string;
    applicationType: 'Individual' | 'Joint';
    otherBorrowerName?: string; // If Joint
}

export interface Employment {
    employerName: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    isSelfEmployed: boolean;
    yearsOnJob: number;
    monthsOnJob: number;
    yearsInLineOfWork?: number;
    position: string;
    startDate?: string;
    endDate?: string; // For previous employment
    monthlyIncome: {
        base: number;
        overtime?: number;
        bonus?: number;
        commission?: number;
        military?: number;
        other?: number;
        total: number;
    };
    employedByFamilyMember?: boolean;
    employedByPartyToTransaction?: boolean;
    ownershipShare?: number; // Percentage
}

export interface Asset {
    type: 'Checking' | 'Savings' | 'MoneyMarket' | 'CertificateOfDeposit' | 'MutualFund' | 'Stocks' | 'Retirement' | 'Crypto' | 'TrustAccount' | 'StockOptions' | 'ProceedsFromSale' | 'Other';
    institutionName: string;
    accountNumber: string; // Last 4 digits
    cashOrMarketValue: number;
}

export interface Liability {
    type: 'Revolving' | 'Installment' | 'Lease' | 'Other';
    companyName: string;
    accountNumber: string;
    unpaidBalance: number;
    monthlyPayment: number;
    toBePaidOff: boolean;
    resubordinated?: boolean;
    omitted?: boolean;
}

export interface RealEstate {
    address: Address;
    propertyValue: number;
    status: 'Sold' | 'Pending' | 'Retained';
    intendedOccupancy: 'Investment' | 'Primary' | 'SecondHome' | 'Other';
    monthlyInsuranceTaxesHOA?: number;
    monthlyRentalIncome?: number;
    mortgageLoans: {
        creditorName: string;
        accountNumber: string;
        monthlyPayment: number;
        unpaidBalance: number;
        type: 'FHA' | 'Conventional' | 'VA' | 'USDA' | 'Other';
    }[];
}

export interface LoanAndProperty {
    loanAmount: number;
    loanPurpose: 'Purchase' | 'Refinance' | 'Other';
    address: Address;
    occupancy: 'PrimaryResidence' | 'SecondHome' | 'InvestmentProperty' | 'FHASecondaryResidence';
    propertyValue: number; // Estimated
    isMixedUse: boolean;
    isManufacturedHome: boolean;
    subordinateFinancing?: number;
    estimatedRentalIncome?: number; // From subject property
}

export interface Declarations {
    a_primaryResidence: boolean;
    b_familyRelationship: boolean;
    c_borrowingMoney: boolean;
    d_otherMortgages: boolean;
    e_newCredit: boolean;
    f_priorityLien: boolean;
    g_coSigner: boolean;
    h_outstandingJudgments: boolean;
    i_delinquentFederalDebt: boolean;
    j_lawsuit: boolean;
    k_foreclosure: boolean;
    l_bankruptcy: boolean;
    m_bankruptcyType?: 'Chapter7' | 'Chapter11' | 'Chapter12' | 'Chapter13';
    explanation?: string; // For any "Yes" answers
}

export interface MilitaryService {
    isVeteran: boolean; // Did you serve?
    isActiveDuty: boolean; // Currently serving?
    isSurvivingSpouse: boolean; // Surviving spouse?
    expirationDate?: string; // If active duty
}

export interface Demographics {
    ethnicity: 'HispanicOrLatino' | 'NotHispanicOrLatino' | 'Refuse';
    race: {
        americanIndianOrAlaskaNative: boolean;
        asian: boolean;
        blackOrAfricanAmerican: boolean;
        nativeHawaiianOrOtherPacificIslander: boolean;
        white: boolean;
        refuse: boolean;
    };
    sex: 'Male' | 'Female' | 'Refuse';
}

export interface Full1003Data {
    // Section 1: Borrower Information
    borrower: BorrowerPersonal;
    currentAddress: AddressHistory;
    mailingAddress?: Address; // If different
    formerAddress?: AddressHistory; // If < 2 years

    // Section 2: Financial Information - Employment
    employment: Employment[];
    otherIncome?: {
        source: string;
        monthlyAmount: number;
    }[];

    // Section 2: Financial Information - Assets & Liabilities
    assets: Asset[];
    liabilities: Liability[];

    // Section 3: Financial Information - Real Estate
    realEstate: RealEstate[];

    // Section 4: Loan and Property Information
    loanAndProperty: LoanAndProperty;
    giftsOrGrants?: {
        type: 'Cash' | 'Equity' | 'Other';
        source: 'Relative' | 'Employer' | 'Agency' | 'Other';
        amount: number;
    }[];

    // Section 5: Declarations
    declarations: Declarations;

    // Section 6: Acknowledgments
    acknowledgments: {
        agreedToElectronicSignatures: boolean;
        dateSigned: string;
    };

    // Section 7: Military Service
    military: MilitaryService;

    // Section 8: Demographic Information
    demographics: Demographics;

    // Section 9: Loan Originator (System populated)
}

export const initial1003Data: Full1003Data = {
    borrower: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        maritalStatus: 'Unmarried',
        dependentsCount: 0,
        dob: '',
        citizenship: 'USCitizen',
        ssn: '',
        applicationType: 'Individual'
    },
    currentAddress: {
        street: '',
        city: '',
        state: '',
        zip: '',
        housingStatus: 'Rent',
        yearsAtAddress: 0,
        monthsAtAddress: 0
    },
    employment: [],
    assets: [],
    liabilities: [],
    realEstate: [],
    loanAndProperty: {
        loanAmount: 0,
        loanPurpose: 'Purchase',
        address: { street: '', city: '', state: '', zip: '' },
        occupancy: 'PrimaryResidence',
        propertyValue: 0,
        isMixedUse: false,
        isManufacturedHome: false
    },
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
    acknowledgments: {
        agreedToElectronicSignatures: false,
        dateSigned: ''
    },
    military: {
        isVeteran: false,
        isActiveDuty: false,
        isSurvivingSpouse: false
    },
    demographics: {
        ethnicity: 'Refuse',
        race: {
            americanIndianOrAlaskaNative: false,
            asian: false,
            blackOrAfricanAmerican: false,
            nativeHawaiianOrOtherPacificIslander: false,
            white: false,
            refuse: true
        },
        sex: 'Refuse'
    }
};

