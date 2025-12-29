
export const ARTICLES = [
    {
        slug: 'mortgage-process',
        title: 'The Mortgage Process: Step-by-Step',
        excerpt: 'From application to closing, understand every step of your journey to homeownership.',
        content: `
            <h2>1. Pre-Approval</h2>
            <p>Before you start house hunting, get pre-approved. This tells you how much you can borrow and shows sellers you are a serious buyer. You'll provide basic financial information to your lender.</p>

            <h2>2. House Hunting</h2>
            <p>Work with a real estate agent to find your dream home. Once you find it, you'll make an offer.</p>

            <h2>3. Application</h2>
            <p>Once your offer is accepted, you'll complete a full mortgage application. This is where you submit your W-2s, bank statements, and other documentation.</p>

            <h2>4. Processing & Underwriting</h2>
            <p>A loan processor organizes your file, and an underwriter reviews it to ensure you meet all loan guidelines. They verify your income, assets, credit, and the property's value (appraisal).</p>

            <h2>5. Closing</h2>
            <p>You'll sign the final paperwork, pay your closing costs and down payment, and get the keys to your new home!</p>
        `
    },
    {
        slug: 'interest-rates-apr',
        title: 'Understanding Interest Rates vs. APR',
        excerpt: 'They sound similar, but knowing the difference can save you thousands.',
        content: `
            <h2>Interest Rate</h2>
            <p>The interest rate is the cost of borrowing money expressed as a percentage. It determines your monthly principal and interest payment.</p>

            <h2>APR (Annual Percentage Rate)</h2>
            <p>The APR is a broader measure of the cost of borrowing. It includes the interest rate PLUS other costs like broker fees, discount points, and some closing costs. It's usually higher than your interest rate and is the best tool for comparing loan offers from different lenders.</p>
        `
    },
    {
        slug: 'credit-score-tips',
        title: 'How to Improve Your Credit Score',
        excerpt: 'A higher score means better rates. Here are quick wins to boost your profile.',
        content: `
            <ul>
                <li><strong>Pay on time:</strong> Payment history is the biggest factor (35% of your score).</li>
                <li><strong>Keep balances low:</strong> Try to keep credit card balances below 30% of your limit.</li>
                <li><strong>Don't close old accounts:</strong> The length of your credit history matters.</li>
                <li><strong>Limit new applications:</strong> Too many "hard inquiries" can temporarily drop your score.</li>
            </ul>
        `
    },
    {
        slug: 'closing-costs',
        title: 'Closing Costs Explained',
        excerpt: 'What are they, how much are they, and who pays them?',
        content: `
            <h2>What are Closing Costs?</h2>
            <p>These are fees paid at the closing of a real estate transaction. They typically range from 2% to 5% of the loan amount.</p>

            <h2>Common Fees</h2>
            <ul>
                <li><strong>Appraisal Fee:</strong> Pays for the property valuation.</li>
                <li><strong>Title Insurance:</strong> Protects against claims on the property title.</li>
                <li><strong>Origination Fee:</strong> Charged by the lender for processing the loan.</li>
                <li><strong>Prepaid Items:</strong> Property taxes and homeowner's insurance paid in advance.</li>
            </ul>
        `
    }
];

export const CHECKLIST_ITEMS = [
    {
        category: 'Income',
        items: [
            'W-2 forms for the past two years',
            'Pay stubs for the last 30 days',
            'Federal tax returns (1040s) for the past two years',
            'Proof of other income (alimony, child support, social security, etc.)'
        ]
    },
    {
        category: 'Assets',
        items: [
            'Bank statements for the last two months (all pages)',
            'Investment account statements (401k, IRA, Stocks)',
            'Gift letter (if using gift funds for down payment)'
        ]
    },
    {
        category: 'Property',
        items: [
            'Purchase agreement (signed by all parties)',
            'Proof of homeowner\'s insurance',
            'Contact info for HOA (if applicable)'
        ]
    },
    {
        category: 'Personal',
        items: [
            'Government-issued ID (Driver\'s License or Passport)',
            'Explanation of credit inquiries (if asked)',
            'Divorce decree or separation agreement (if applicable)'
        ]
    }
];

export const GLOSSARY_TERMS = [
    { term: 'Amortization', definition: 'The process of paying off a debt over time through regular payments.' },
    { term: 'Appraisal', definition: 'An unbiased professional opinion of a home\'s value.' },
    { term: 'Closing Costs', definition: 'Fees and expenses, over and above the price of the property, incurred by the buyer and seller.' },
    { term: 'Debt-to-Income (DTI) Ratio', definition: 'The percentage of your gross monthly income that goes to paying your monthly debt payments.' },
    { term: 'Down Payment', definition: 'The portion of the purchase price that you pay upfront in cash.' },
    { term: 'Equity', definition: 'The difference between the market value of your home and the amount you owe on your mortgage.' },
    { term: 'Escrow', definition: 'A neutral third party that holds funds and documents during a real estate transaction.' },
    { term: 'Fixed-Rate Mortgage', definition: 'A mortgage with an interest rate that stays the same for the entire life of the loan.' },
    { term: 'Loan-to-Value (LTV) Ratio', definition: 'A risk assessment ratio that compares the amount of the mortgage with the appraised value of the property.' },
    { term: 'PMI (Private Mortgage Insurance)', definition: 'Insurance that protects the lender in case you default on your loan, usually required if your down payment is less than 20%.' },
    { term: 'Pre-Approval', definition: 'A written commitment from a lender to give you a mortgage loan up to a specific amount.' },
    { term: 'Title Insurance', definition: 'Insurance that protects the lender (and optionally the owner) against losses due to disputes over the title of the property.' }
];
