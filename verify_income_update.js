
// 1. Define the simulated extracted data (what classifyDocument would return for 'tax_return_high_income.txt')
const simulatedExtractedData = {
    income: 12500,
    employment: {
        status: 'Self-Employed',
        startDate: '2018-01-01',
        monthlyIncome: 12500
    }
};

// 2. Find a document requirement ID to "upload" to (e.g., Tax Returns)
const context = window.documentContext;
const taxReturnReq = context.documents.find(d => d.type === 'TAX_RETURN');

if (taxReturnReq) {
    console.log("Found Tax Return requirement:", taxReturnReq.id);

    // 3. Create a dummy file
    const file = new File(["dummy content"], "tax_return_high_income.txt", { type: "text/plain" });

    // 4. Call addDocumentFile WITH the extracted data
    console.log("Adding document with extracted data...");
    context.addDocumentFile(taxReturnReq.id, file, ["High Income Detected"], simulatedExtractedData);

    console.log("Document added. Waiting for UI update...");
} else {
    console.error("Could not find Tax Return requirement");
}
