
(async () => {
    console.log("Starting Auto-Fill Verification...");

    // Helper to wait for context
    const waitForContext = async () => {
        let retries = 0;
        while (!window.documentContext && retries < 20) {
            console.log("Waiting for documentContext...");
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

    console.log("Context loaded. Documents:", context.documents);

    // 1. Simulate W2 Data
    const simulatedW2Data = {
        employment: {
            employerName: "Acme Corp",
            monthlyIncome: 8500,
            status: "Employed"
        },
        borrower: {
            ssn: "123-45-6789"
        }
    };

    // 2. Simulate ID Data
    const simulatedIDData = {
        borrower: {
            firstName: "Jane",
            lastName: "Doe",
            dateOfBirth: "01/01/1985"
        }
    };

    // 3. Add W2
    let w2Req = context.documents.find(d => d.type === 'W2');
    if (!w2Req) {
        console.log("W2 requirement missing, adding it...");
        context.addRequirement('W2', 'W-2 Forms');
        // Wait for state update
        await new Promise(r => setTimeout(r, 500));
        w2Req = context.documents.find(d => d.type === 'W2');
    }

    if (w2Req) {
        console.log("Adding W2 to", w2Req.id);
        const file = new File(["w2 content"], "w2_2023.pdf", { type: "application/pdf" });
        context.addDocumentFile(w2Req.id, file, ["W2 Detected"], simulatedW2Data);
    }

    // 4. Add ID
    let idReq = context.documents.find(d => d.type === 'ID');
    if (!idReq) {
        console.log("ID requirement missing, adding it...");
        context.addRequirement('ID', 'Photo ID');
        await new Promise(r => setTimeout(r, 500));
        idReq = context.documents.find(d => d.type === 'ID');
    }

    if (idReq) {
        console.log("Adding ID to", idReq.id);
        const file = new File(["id content"], "driver_license.jpg", { type: "image/jpeg" });
        context.addDocumentFile(idReq.id, file, ["ID Detected"], simulatedIDData);
    }

    console.log("Documents added. Waiting for analysis...");
})();
