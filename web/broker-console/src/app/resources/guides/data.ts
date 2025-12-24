export type GuideArticle = {
    title: string;
    category: string;
    content: string; // Using simple HTML strings for now for flexibility
};

export const guidesData: Record<string, GuideArticle> = {
    'setting-up-profile': {
        title: "Setting up your Broker Profile",
        category: "Getting Started",
        content: `
            <p>Your Broker Profile is how clients recognize you and how we customize your experience. Keeping it up to date is crucial for proper document routing and notifications.</p>
            
            <h3>Steps to Update Profile</h3>
            <ol>
                <li>Log in to your Dashboard.</li>
                <li>Click on the <strong>Settings</strong> icon in the top right corner.</li>
                <li>Navigate to the <strong>Profile</strong> tab.</li>
                <li>Update your <strong>NMLS Number</strong>, <strong>Contact Email</strong>, and <strong>Phone Number</strong>.</li>
                <li>Click <strong>Save Changes</strong>.</li>
            </ol>
            
            <h3>Profile Photo</h3>
            <p>We recommend uploading a professional headshot. This photo will appear on the borrower's portal, giving them confidence they are working with a real expert.</p>
        `
    },
    'inviting-client': {
        title: "Inviting your first client",
        category: "Getting Started",
        content: `
            <p>LoanAuto makes it easy to onboard new borrowers. You can send them a direct invite link that tracks their application back to your pipeline.</p>
            
            <h3>Sending an Invite</h3>
            <ol>
                <li>From the Dashboard, click the <strong>Invite Borrower</strong> button (usually top right).</li>
                <li>Enter the borrower's <strong>Email Address</strong> and <strong>First Name</strong>.</li>
                <li>(Optional) Add a personal note to the welcome email.</li>
                <li>Click <strong>Send Invitation</strong>.</li>
            </ol>
            
            <p>The borrower will receive an email with a secure link to create their account and start their application.</p>
        `
    },
    'dashboard-overview': {
        title: "Understanding the Dashboard",
        category: "Getting Started",
        content: `
            <p>Your Dashboard is the command center for all your loan files. Here's a quick breakdown of what you see:</p>
            
            <h3>Pipeline View</h3>
            <ul>
                <li><strong>Active Applications</strong>: Files currently being processed or waiting for action.</li>
                <li><strong>Action Required</strong>: Files where you or the borrower need to upload documents or resolve conditions.</li>
                <li><strong>Pending Underwriting</strong>: Files currently being analyzed by our AI.</li>
            </ul>
            
            <h3>Status Indicators</h3>
            <p>We use color-coded badges to help you prioritize:</p>
            <ul>
                <li><span style="color: green;">Green</span>: Pre-Approved or Funded.</li>
                <li><span style="color: yellow;">Yellow</span>: Needs Review or Missing Info.</li>
                <li><span style="color: red;">Red</span>: Declined or Critical Error.</li>
            </ul>
        `
    },
    'scanning-best-practices': {
        title: "Best practices for scanning",
        category: "Document Management",
        content: `
            <p>High-quality scans ensure faster AI processing and fewer manual conditions. Share these tips with your borrowers.</p>
            
            <h3>Recommended Settings</h3>
            <ul>
                <li><strong>Format</strong>: PDF is preferred, but high-res JPG/PNG works.</li>
                <li><strong>Resolution</strong>: 300 DPI or higher.</li>
                <li><strong>Color</strong>: Grayscale or Color (Black & White is okay if legible).</li>
            </ul>
            
            <h3>Common Issues to Avoid</h3>
            <ul>
                <li><strong>Blurry Text</strong>: Ensure camera focus is sharp.</li>
                <li><strong>Cut-off Edges</strong>: The entire document page must be visible.</li>
                <li><strong>Shadows/Glare</strong>: lighting should be even to avoid obscuring text.</li>
            </ul>
        `
    },
    'resolving-ocr-errors': {
        title: "Resolving OCR errors",
        category: "Document Management",
        content: `
            <p>Our AI is over 99% accurate, but handwriting or poor scans can sometimes lead to missed data. You have full control to correct this.</p>
            
            <h3>How to Edit Data</h3>
            <ol>
                <li>Open the specific loan file.</li>
                <li>Go to the <strong>Documents</strong> tab.</li>
                <li>Click on the document marked with a warning icon.</li>
                <li>In the preview pane, click <strong>Edit Details</strong>.</li>
                <li>Manually correct the income, employer, or date fields.</li>
                <li>Click <strong>Save & Re-run Analysis</strong>.</li>
            </ol>
        `
    },
    'secure-sharing': {
        title: "Secure document sharing",
        category: "Document Management",
        content: `
            <p>Security is our top priority. LoanAuto saves you from emailing sensitive PDFs back and forth.</p>
            
            <h3>Encryption</h3>
            <p>All documents are encrypted <strong>at rest</strong> (AES-256) and <strong>in transit</strong> (TLS 1.3). Only authorized users (you, the borrower, and designated underwriters) can view the decrypted file.</p>
            
            <h3>Sharing with Third Parties</h3>
            <p>If you need to share a file with an external party (e.g., a title officer), use the <strong>Secure Link</strong> feature in the document menu. You can set an expiration time and password for the link.</p>
        `
    },
    'interpreting-ai': {
        title: "Interpreting AI decisions",
        category: "Underwriting & Conditions",
        content: `
            <p>Our AI analyzes income, assets, and credit to generate a preliminary decision. Understanding this helps you manage client expectations.</p>
            
            <h3>Confidence Scores</h3>
            <p>Every extracted data point comes with a confidence score. If the score is below 80%, we flag it for your manual review.</p>
            
            <h3>Logic Explanations</h3>
            <p>When a condition is set (e.g., "Large Deposit Explanation"), hover over the info icon to see <em>why</em> the AI triggered it. For example: <em>"Deposit of $5,000 on 12/01 exceeds 50% of monthly qualifying income."</em></p>
        `
    },
    'clearing-conditions': {
        title: "Clearing conditions automatically",
        category: "Underwriting & Conditions",
        content: `
            <p>The fastest way to close a loan is to let the AI clear conditions for you.</p>
            
            <h3>Process</h3>
            <ol>
                <li>Identify the Open Condition (e.g., "Provide W2 for 2023").</li>
                <li>Upload the requested document into the <strong>Conditions</strong> bucket.</li>
                <li>The AI automatically classifies the document.</li>
                <li>If the document matches the requirement, the condition is marked <strong>Cleared</strong> instantly.</li>
            </ol>
            
            <p>No waiting for an underwriter to open an email!</p>
        `
    },
    'manual-review': {
        title: "Requesting manual review",
        category: "Underwriting & Conditions",
        content: `
            <p>Some files are complex and require a human touch. You can escalate any file to our manual underwriting team.</p>
            
            <h3>When to Escalate</h3>
            <ul>
                <li>Self-employed borrowers with complex tax returns.</li>
                <li>Properties with unique characteristics.</li>
                <li>When you disagree with an AI decision/condition.</li>
            </ul>
            
            <h3>How to Request</h3>
            <p>Click the <strong>Request Manual Review</strong> button on the Loan Summary page. Add a note explaining the specific situation. Our SLA for manual review is 4 business hours.</p>
        `
    },
};
