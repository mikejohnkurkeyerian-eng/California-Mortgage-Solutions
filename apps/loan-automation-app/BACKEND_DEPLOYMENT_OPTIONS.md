# Backend Deployment Options

## Current Situation

Your backend services are currently running **locally** on your computer:
- `loan-service`: port 4002
- `document-service`: port 4003
- `workflow-service`: port 4004
- `rules-service`: port 4005

**You don't have a production backend URL yet.** You need to deploy these services to make them accessible.

---

## Option 1: Quick Testing (Temporary Solution)

### Use ngrok or similar tunneling service

**For quick testing/demos only** - not for production:

1. **Install ngrok**: https://ngrok.com/download
2. **Start your backend services**:
   ```powershell
   pnpm start
   ```
3. **Create tunnel**:
   ```powershell
   ngrok http 4002
   ```
4. **Use the ngrok URL** in your app:
   ```
   https://abc123.ngrok.io
   ```

**Limitations:**
- Free tier has time limits
- URLs change on restart
- Not suitable for production

---

## Option 2: Deploy to Cloud (Recommended for Production)

### A. Railway (Easiest - Recommended for Quick Start)

1. **Sign up**: https://railway.app
2. **Create new project**
3. **Deploy each service**:
   - Connect GitHub repo
   - Set environment variables
   - Deploy automatically

**Cost**: Free tier available, then ~$5-20/month

**Example URLs after deployment**:
```
https://loan-service-production.up.railway.app
https://document-service-production.up.railway.app
```

### B. Render (Free Tier Available)

1. **Sign up**: https://render.com
2. **Create Web Service** for each backend service
3. **Connect GitHub repo**
4. **Deploy**

**Cost**: Free tier for testing, then ~$7-25/month per service

### C. Heroku (Classic, but more expensive)

1. **Sign up**: https://heroku.com
2. **Install Heroku CLI**
3. **Deploy each service**

**Cost**: ~$7-25/month per service (no free tier anymore)

### D. AWS/Google Cloud/Azure (Enterprise)

- More complex setup
- Better for large scale
- Requires more configuration
- Cost varies by usage

---

## Option 3: Use Your Local IP (For Testing on Same Network)

If you're just testing on devices on the same WiFi:

1. **Find your local IP**:
   ```powershell
   .\get-ip.ps1
   ```
   Example: `192.168.1.100`

2. **Update API config** for production:
   ```typescript
   // In api.ts, production mode:
   return `http://192.168.1.100:${port}`;
   ```

3. **Keep backend running** on your computer
4. **Ensure firewall allows** ports 4002-4006

**Limitations:**
- Only works on same WiFi network
- Your computer must be running
- Not accessible from outside your network

---

## Recommended Approach

### For Quick Testing/Demo:
1. Use **ngrok** or **Railway free tier**
2. Get a public URL
3. Update API config with that URL

### For Production:
1. Deploy to **Railway** or **Render**
2. Get permanent URLs
3. Update API config
4. Build production APK

---

## Step-by-Step: Deploy to Railway (Easiest)

### 1. Prepare Services for Deployment

Each service needs:
- `package.json` with `start` script ✅ (you have this)
- Environment variables (if needed)
- Port configuration (Railway provides `PORT` env var)

### 2. Update Services to Use PORT Environment Variable

Your services already use:
```typescript
const port = process.env.PORT ?? 4002;
```

This is perfect! Railway will set `PORT` automatically.

### 3. Deploy to Railway

1. Go to https://railway.app
2. Sign up/login
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your repository
6. Railway will detect your services
7. Deploy each service separately

### 4. Get Your URLs

After deployment, Railway gives you URLs like:
```
https://loan-service-production.up.railway.app
https://document-service-production.up.railway.app
```

### 5. Update App Config

Edit `apps/loan-automation-app/src/config/api.ts`:

```typescript
} else {
  // Production mode
  return `https://loan-service-production.up.railway.app`;
  // Note: Railway uses port 443 (HTTPS) automatically
  // So you don't need to specify :4002
}
```

**But wait!** Your services use `/api` prefix, so you'd need:
```typescript
return `https://loan-service-production.up.railway.app/api`;
```

Actually, better approach - use a single backend URL with routing, or deploy all services behind one domain.

---

## Quick Solution: Single Backend Service

For simplicity, you could:
1. Create one Express server that routes to all services
2. Deploy that single service
3. Use one URL for everything

Or deploy each service separately and use different URLs.

---

## What Should You Do Now?

### Immediate (For Testing):
1. **Use ngrok** for quick testing
2. Or **use your local IP** if testing on same network

### For Production:
1. **Deploy to Railway** (easiest)
2. Get production URLs
3. Update `api.ts` with those URLs
4. Build production APK

---

## Need Help Choosing?

**Tell me:**
- Are you just testing, or going to real users?
- Do you have a budget for hosting?
- How many users do you expect?

I can help you choose the best option!

