# Quick Vercel Deployment Steps

## 🚀 Quick Start (5 minutes)

### Prerequisites
- ✅ Backend deployed (Railway/Render/Heroku)
- ✅ Backend URL ready (e.g., `https://your-backend.railway.app`)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy from Root Directory
```bash
# Make sure you're in the root directory (quiz-deploy)
vercel
```

Follow prompts:
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No** (first time)
- Project name? → Press Enter (default)
- Directory? → **./** (current)

### Step 4: Add Environment Variables
```bash
vercel env add NEXT_PUBLIC_API_URL
# Paste your backend URL: https://your-backend.railway.app

vercel env add NEXT_PUBLIC_SOCKET_URL  
# Paste your backend URL: https://your-backend.railway.app
```

### Step 5: Deploy to Production
```bash
vercel --prod
```

**Done!** Your app is live at `https://your-project.vercel.app`

---

## 📋 Alternative: Deploy via Vercel Dashboard

### Step 1: Go to Vercel
Visit [vercel.com](https://vercel.com) and sign in

### Step 2: Import Project
1. Click **"Add New Project"**
2. Import your Git repository
3. Configure:
   - **Framework Preset**: Next.js (auto-detected from vercel.json)
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT: Set this to `frontend`**
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   
   **OR** Vercel will auto-detect from `vercel.json` in the root if you set Root Directory correctly

### Step 3: Add Environment Variables
Before deploying, click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app` |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-backend.railway.app` |

### Step 4: Deploy
Click **"Deploy"** and wait for build to complete.

---

## 🔧 Important Notes

### Backend Deployment
Your backend must be deployed first! Options:
- **Railway**: [railway.app](https://railway.app) - Easy, free tier available
- **Render**: [render.com](https://render.com) - Free tier available
- **Heroku**: [heroku.com](https://heroku.com) - Requires credit card

### CORS Configuration
Update your backend to allow your Vercel domain:
```typescript
// In backend CORS config
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app.vercel.app'
]
```

### Socket.io Considerations
- Some hosting providers require special WebSocket configuration
- Ensure your backend supports WebSocket connections
- Test socket connections after deployment

---

## 🐛 Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally first

**API calls fail?**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend CORS settings
- Test backend URL directly in browser

**Socket.io not working?**
- Verify `NEXT_PUBLIC_SOCKET_URL` is set
- Check backend WebSocket support
- Some providers need special WebSocket config

**Environment variables not working?**
- Variables must start with `NEXT_PUBLIC_` to be exposed to browser
- Redeploy after adding/changing variables
- Check "Production" environment is selected

---

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Backend REST API URL | `https://api.example.com` |
| `NEXT_PUBLIC_SOCKET_URL` | ✅ Yes | Socket.io server URL | `https://api.example.com` |

**Note:** Both are typically the same URL if your backend handles both REST and WebSocket.

---

## 🔄 Continuous Deployment

Once connected to Git:
- Push to `main` → Auto-deploys to production
- Push to other branches → Creates preview deployment

---

## 🌐 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## ✅ Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Environment variables are set in Vercel
- [ ] CORS allows your Vercel domain
- [ ] Test sign up/login
- [ ] Test creating a quiz
- [ ] Test joining a quiz room
- [ ] Test socket.io connections
- [ ] Check browser console for errors

---

**Need help?** Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

