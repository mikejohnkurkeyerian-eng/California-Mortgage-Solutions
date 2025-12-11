export interface Lender {
    id: string;
    name: string;
    logoColor: string;
    description: string;
    minCreditScore: number;
    maxLTV: number;
    avgTurnAroundTime: string;
}

export const MOCK_LENDERS: Lender[] = [
    {
        id: 'rocket',
        name: 'Rocket Mortgage',
        logoColor: 'red',
        description: 'Fast approvals for conventional and FHA loans.',
        minCreditScore: 580,
        maxLTV: 97,
        avgTurnAroundTime: '24-48 Hours'
    },
    {
        id: 'uwm',
        name: 'United Wholesale Mortgage',
        logoColor: 'blue',
        description: 'Industry leading turn-times and competitive rates.',
        minCreditScore: 620,
        maxLTV: 95,
        avgTurnAroundTime: '12-24 Hours'
    },
    {
        id: 'pennymac',
        name: 'PennyMac',
        logoColor: 'purple',
        description: 'Great for government loans (VA/USDA).',
        minCreditScore: 600,
        maxLTV: 100,
        avgTurnAroundTime: '3-4 Days'
    },
    {
        id: 'flagstar',
        name: 'Flagstar Bank',
        logoColor: 'emerald',
        description: 'Portfolio products and jumbo loans.',
        minCreditScore: 680,
        maxLTV: 80,
        avgTurnAroundTime: '5-7 Days'
    }
];
