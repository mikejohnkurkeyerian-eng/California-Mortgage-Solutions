const Tesseract = require('tesseract.js');
const path = require('path');

const files = [
    { name: 'Pay Stub', path: 'public/test_paystub.png', expectedType: 'PAY_STUB', keywords: ['pay stub', 'earnings statement', 'period ending', 'net pay'] },
    { name: 'W-2', path: 'public/test_w2.png', expectedType: 'W2', keywords: ['w-2', 'wage and tax statement', 'employer id'] },
    { name: 'Bank Statement', path: 'public/test_bank.jpg', expectedType: 'BANK_STATEMENT', keywords: ['bank statement', 'account summary', 'beginning balance', 'ending balance', 'statement of account'] },
    { name: 'ID', path: 'public/test_id.jpg', expectedType: 'ID', keywords: ['driver license', 'identification', 'date of birth', 'sex', 'hgt', 'class', 'exp'] }
];

// Mock of the new scoring logic to verify it works in isolation
function classifyText(text) {
    const lowerText = text.toLowerCase();
    const patterns = {
        W2: {
            keywords: [
                { term: 'w-2', weight: 10 },
                { term: 'wage and tax statement', weight: 10 },
                { term: 'employer identification number', weight: 5 },
                { term: 'employer id', weight: 5 },
                { term: 'social security wages', weight: 5 },
                { term: 'federal income tax withheld', weight: 5 },
                { term: 'box 1', weight: 3 },
                { term: 'box 2', weight: 3 },
                { term: 'omb no', weight: 3 }
            ],
            score: 0
        },
        PAY_STUB: {
            keywords: [
                { term: 'pay stub', weight: 10 },
                { term: 'earnings statement', weight: 10 },
                { term: 'period ending', weight: 5 },
                { term: 'pay date', weight: 5 },
                { term: 'net pay', weight: 5 },
                { term: 'gross pay', weight: 5 },
                { term: 'ytd', weight: 3 },
                { term: 'year to date', weight: 3 },
                { term: 'deductions', weight: 3 },
                { term: 'rate', weight: 2 },
                { term: 'hours', weight: 2 }
            ],
            score: 0
        },
        BANK_STATEMENT: {
            keywords: [
                { term: 'bank statement', weight: 10 },
                { term: 'statement of account', weight: 10 },
                { term: 'account summary', weight: 8 },
                { term: 'beginning balance', weight: 5 },
                { term: 'ending balance', weight: 5 },
                { term: 'deposits', weight: 3 },
                { term: 'withdrawals', weight: 3 },
                { term: 'checks', weight: 2 },
                { term: 'daily balance', weight: 2 }
            ],
            score: 0
        },
        ID: {
            keywords: [
                { term: 'driver license', weight: 10 },
                { term: 'identification', weight: 8 },
                { term: 'date of birth', weight: 5 },
                { term: 'dob', weight: 5 },
                { term: 'exp', weight: 5 },
                { term: 'expires', weight: 5 },
                { term: 'sex', weight: 3 },
                { term: 'hgt', weight: 3 },
                { term: 'wgt', weight: 3 },
                { term: 'class', weight: 3 },
                { term: 'iss', weight: 3 },
                { term: 'ln', weight: 2 },
                { term: 'fn', weight: 2 }
            ],
            score: 0
        }
    };

    let maxScore = 0;
    let detectedType = 'OTHER';

    for (const [type, data] of Object.entries(patterns)) {
        for (const { term, weight } of data.keywords) {
            if (lowerText.includes(term)) {
                data.score += weight;
            }
        }

        if (data.score > maxScore) {
            maxScore = data.score;
            detectedType = type;
        }
    }

    return { type: detectedType, score: maxScore };
}

async function verify() {
    console.log("Starting Advanced OCR Verification...");

    for (const file of files) {
        console.log(`\nScanning ${file.name} (${file.path})...`);
        try {
            const result = await Tesseract.recognize(
                path.join(__dirname, file.path),
                'eng'
            );

            const text = result.data.text;
            const classification = classifyText(text);

            console.log(`Extracted ${text.length} characters.`);
            console.log(`Score: ${classification.score}`);

            if (classification.type === file.expectedType) {
                console.log(`✅ SUCCESS: Identified as ${classification.type}`);
            } else {
                console.log(`❌ FAILURE: Identified as ${classification.type} (Expected ${file.expectedType})`);
                if (text.length < 50) console.log("   Reason: Text extraction failed (too short/blurry).");
            }

        } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
        }
    }
}

verify();
