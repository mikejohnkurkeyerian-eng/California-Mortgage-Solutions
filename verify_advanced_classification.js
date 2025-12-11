
(async () => {
    console.log("Starting Advanced Classification Verification...");

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

    // Create a "Divorce Decree" file with generic name
    const divorceContent = `
        SUPERIOR COURT OF CALIFORNIA
        COUNTY OF LOS ANGELES
        
        Petitioner: Jane Doe
        Respondent: John Doe
        
        DISSOLUTION OF MARRIAGE
        
        FINAL JUDGMENT
        
        The court orders that the marriage is dissolved.
        Child Support: $1,000 per month.
        Alimony: $500 per month.
    `;
    const file = new File([divorceContent], "unknown_legal_doc.txt", { type: "text/plain" });

    // We can't easily check the internal classification result directly without hooking into the logs or state.
    // However, we can check if the console logs show the classification score.

    // We'll upload it to a generic bucket or just use the first available requirement to trigger the classifier.
    // The classifier runs on *any* upload.
    const req = context.documents[0]; // Just pick the first one
    if (req) {
        console.log("Uploading generic file with Divorce Decree content...");
        context.addDocumentFile(req.id, file);
        console.log("Upload started. Check console for 'Score for DIVORCE_DECREE'");
    }

})();
