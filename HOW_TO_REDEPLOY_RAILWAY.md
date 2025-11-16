# How to Redeploy in Railway

## Quick Steps

### Method 1: Redeploy from Dashboard (Easiest)

1. **Go to Railway Dashboard**: https://railway.app/dashboard
2. **Click on your project** (the one with your services)
3. **Click on the service** you want to redeploy (e.g., `loan-service`)
4. **Click the "Deployments" tab** (or look for a "Redeploy" button)
5. **Click "Redeploy"** or **"Deploy"** button (usually at the top right)
6. **Wait for deployment** to complete (2-5 minutes)

### Method 2: Trigger Redeploy by Pushing Code

If you push updated code to GitHub, Railway will automatically redeploy:

1. **Push your changes to GitHub:**
   ```powershell
   git add .
   git commit -m "Update Railway config"
   git push
   ```

2. **Railway will automatically detect the push** and start a new deployment
3. **Check the "Deployments" tab** to see the new deployment in progress

### Method 3: Manual Redeploy via Settings

1. **Go to your service** in Railway
2. **Click "Settings" tab**
3. **Scroll down** to find deployment options
4. **Click "Redeploy"** or **"Trigger Deploy"**

---

## Visual Guide

### Step-by-Step:

1. **Open Railway Dashboard**
   - Go to: https://railway.app/dashboard
   - You should see your project

2. **Select Your Project**
   - Click on the project name

3. **Select the Service**
   - Click on `loan-service` (or whichever service you want to redeploy)

4. **Find Redeploy Button**
   - Look for a **"Redeploy"** or **"Deploy"** button
   - It's usually:
     - At the top right of the service page
     - In the "Deployments" tab
     - Or in the "Settings" tab

5. **Click Redeploy**
   - Confirm if asked
   - Wait for deployment to start

6. **Monitor Progress**
   - Go to **"Deployments"** tab
   - You'll see the new deployment building
   - Click on it to see logs

---

## After Redeploying

1. **Check Build Logs**
   - Click on the deployment
   - View logs to see if it's working
   - Look for "Successfully prepared" or "Build completed"

2. **Wait for Completion**
   - Build takes 2-5 minutes
   - You'll see a green checkmark when done

3. **Test Your Service**
   - Click on the service URL
   - Or test: `curl https://your-service.up.railway.app/health`

---

## Troubleshooting

### Can't Find Redeploy Button?

- **Check "Deployments" tab** - it's usually there
- **Look for three dots menu** (⋯) - might be in a dropdown
- **Check if service is already deploying** - you might need to wait

### Redeploy Not Working?

- **Make sure you're in the right service**
- **Check if there are any errors** in the current deployment
- **Try updating the build command** in Settings first, then redeploy

---

## Quick Reference

**Redeploy Location**: Service → Deployments tab → Redeploy button

**Auto-redeploy**: Push code to GitHub → Railway detects → Auto-deploys

**Manual redeploy**: Dashboard → Service → Redeploy button

---

**Need help?** Let me know if you can't find the redeploy button and I'll guide you through it!

