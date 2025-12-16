const Tesseract = require('tesseract.js');
const path = require('path');

const files = [
    { name: 'Pay Stub', path: 'public/test_paystub.png', expectedType: 'PAY_STUB', keywords: ['pay stub', 'earnings statement', 'period ending', 'net pay'] },
    { name: 'W-2', path: 'public/test_w2.png', expectedType: 'W2', keywords: ['w-2', 'wage and tax statement', 'employer id'] },
    { name: 'Bank Statement', path: 'public/test_bank.jpg', expectedType: 'BANK_STATEMENT', keywords: ['bank statement', 'account summary', 'beginning balance', 'ending balance', 'statement of account'] },
    { name: 'ID', path: 'public/test_id.jpg', expectedType: 'ID', keywords: ['driver license', 'identification', 'date of birth', 'sex', 'hgt', 'class', 'exp'] }
];

async function verify() {
    console.log("Starting OCR Verification...");

    for (const file of files) {
        console.log(`\nScanning ${file.name} (${file.path})...`);
        try {
            const result = await Tesseract.recognize(
                path.join(__dirname, file.path),
                'eng'
            );

            const text = result.data.text.toLowerCase();
            console.log(`Extracted ${text.length} characters.`);

            const foundKeywords = file.keywords.filter(k => text.includes(k));

            if (foundKeywords.length > 0) {
                console.log(`✅ SUCCESS: Identified as ${file.expectedType}`);
                console.log(`   Found keywords: ${foundKeywords.join(', ')}`);
            } else {
                console.log(`❌ FAILURE: Could not identify as ${file.expectedType}`);
                console.log(`   Expected one of: ${file.keywords.join(', ')}`);
                console.log(`   Partial Text Content: ${text.substring(0, 200)}...`);
            }

        } catch (error) {
            console.error(`Error processing ${file.name}:`, error);
        }
    }
}

verify();
