
(async () => {
    console.log("Starting Content-Based Classification Verification...");

    // Helper to wait for context
    const waitForContext = async () => {
        let retries = 0;
        while (!window.documentContext && retries < 20) {
            await new Promise(r => setTimeout(r, 500));
            retries++;
        }
        return window.documentContext;
    };

    const context = await waitForContext();
    if (!context) {
        console.error("Failed to load documentContext");
        return;
    }

    // 1. Create a "W2" file but with a generic name
    const w2Content = `
        Wage and Tax Statement
        Employer: Acme Corp
        SSN: 123-45-6789
        Wages, tips, other compensation: 100000.00
        Federal income tax withheld: 20000.00
        Social security wages: 100000.00
    `;
    const file = new File([w2Content], "random_file_123.txt", { type: "text/plain" });

    // 2. We need to access the internal classifyDocument function or observe the effect.
    // Since we can't easily call classifyDocument directly from here without exposing it,
    // we will use addDocumentFile and see if it gets assigned to a W2 requirement or if we can inspect the result.
    // Actually, addDocumentFile takes a requirementId. 
    // The user wants the bot to *identify* the document. 
    // In the current UI, the user usually uploads to a specific bucket.
    // However, if we want to test classification, we might need to look at how the "Smart Upload" or "Inbox" feature works, 
    // or just verify that the *extracted data* is correct, which implies classification worked if we had a "General Upload" feature.
    // But wait, the current `addDocumentFile` logic *does* run `classifyDocument`.
    // Let's see if we can trigger a "Smart Upload" where the system decides where it goes.
    // If not, we'll just check if the `analyzedData` reflects the W2 data, which implies the parser for W2 ran, which implies it was classified as W2.

    // Let's try to find a W2 requirement and upload there, but check the console logs for "Classified as: W2".
    // Or better, we can check if `extractedData` is populated correctly.

    const w2Req = context.documents.find(d => d.type === 'W2');
    if (w2Req) {
        console.log("Uploading generic file to W2 bucket...");
        // We are testing if the *classifier* works. 
        // Even if we upload to W2 bucket, the code runs classifyDocument.
        // We want to verify it detects W2 *despite* the filename.
        context.addDocumentFile(w2Req.id, file);
        console.log("Upload started. Check console for 'Classified as: W2' or 'Running DocumentExtractor for W2'");
    }

})();
