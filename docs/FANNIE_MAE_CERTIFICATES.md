# Fannie Mae Integration Guide: Certificates & Credentials

To enable the **Real Mode** integration with Fannie Mae's Desktop Underwriter (DU), you must obtain and install valid digital certificates. This guide outlines the process.

## 1. Obtaining Certificates from Fannie Mae

You must be an approved Fannie Mae Seller/Servicer or Technology Partner.

1.  **Log in to Fannie Mae Technology Manager**:
    *   Access the [Fannie Mae Technology Manager](https://technologymanager.fanniemae.com/).
    *   You need "Corporate Administrator" or "Technology Manager Administrator" access.

2.  **Request a Software Subscription**:
    *   Navigate to **Manage Applications**.
    *   Request access for **Desktop Underwriter (DU)** API.

3.  **Generate Digital Certificates**:
    *   Go to the **Digital Certificates** section.
    *   Select **Request New Certificate**.
    *   Choose **B2B / System-to-System** certificate type.
    *   Follow the prompts to generate the certificate request (CSR) or download the provided `.p12` (PKCS#12) file.
    *   **Important**: You will be given a password for the `.p12` file. **Save this password securely.**

4.  **Download Credentials**:
    *   You will receive:
        *   **Client ID** (Consumer Key)
        *   **Client Secret**
        *   **Certificate File** (usually `filename.p12` or `filename.pem`)

## 2. Installing Certificates in the Application

Once you have the files, you need to place them where the `loan-service` can access them.

### A. Place the Files
1.  Create a secure directory in your backend service:
    ```bash
    mkdir -p services/loan-service/certs
    ```
2.  Copy your `.p12` or `.pem` file into this directory.
    *   Example: `services/loan-service/certs/fanniemae_prod.p12`

### B. Configure Environment Variables
Update your `.env` file in `services/loan-service` (or your deployment secrets) with the following:

```env
# Fannie Mae Configuration
FANNIE_MAE_CERT_PATH="./certs/fanniemae_prod.p12"
FANNIE_MAE_CERT_PASSWORD="your-certificate-password"
```

### C. Update the Code (Developer Step)
The `AUSAgent` needs to be updated to read these files when making the Axios request.

**File:** `services/loan-service/src/aus-agent.ts`

```typescript
import fs from 'fs';
import https from 'https';

// ... inside authenticateReal method ...

const certPath = process.env.FANNIE_MAE_CERT_PATH;
const certPass = process.env.FANNIE_MAE_CERT_PASSWORD;

if (certPath && fs.existsSync(certPath)) {
    const httpsAgent = new https.Agent({
        pfx: fs.readFileSync(certPath),
        passphrase: certPass,
        // OR if using PEM keys:
        // cert: fs.readFileSync('path/to/client.crt'),
        // key: fs.readFileSync('path/to/client.key'),
    });

    const response = await axios.post(FANNIE_MAE_AUTH_URL, {
        grant_type: 'client_credentials',
        client_id: brokerSettings.clientId,
        client_secret: decryptedSecret
    }, {
        httpsAgent: httpsAgent // Attach the cert agent here
    });
}
```

## 3. Verification
1.  Restart the `loan-service`.
2.  Go to **Broker Settings** in the web UI.
3.  Enter your **Client ID** and **Client Secret**.
4.  Run a loan through AUS.
5.  Check the logs to ensure the Mutual TLS (mTLS) handshake is successful.
