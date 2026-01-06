# Vercel Deployment Guide

This guide will help you deploy your Next.js quiz application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your backend API deployed (see Backend Deployment section)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Deploy Your Backend First

**Important:** You need to deploy your backend API before deploying the frontend, as the frontend depends on it.

### Option A: Deploy Backend to Railway/Render/Heroku

1. **Railway** (Recommended):
   - Go to [railway.app](https://railway.app)
   - Create a new project
   - Connect your repository
   - Select the `backend` folder
   - Set environment variables (database URL, JWT secret, etc.)
   - Deploy

2. **Render**:
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your repository
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Set environment variables

3. **Heroku**:
   - Install Heroku CLI
   - `cd backend`
   - `heroku create your-app-name`
   - `git subtree push --prefix backend heroku main`
   - Set environment variables in Heroku dashboard

### Option B: Keep Backend on Localhost (Development Only)

If you're just testing, you can keep the backend running locally, but this won't work for production.

## Step 2: Update Environment Variables

Once your backend is deployed, note the URL (e.g., `https://your-backend.railway.app`)

## Step 3: Deploy Frontend to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (first time)
   - Project name? (Press Enter for default)
   - Directory? **./** (current directory)
   - Override settings? **No**

5. **Set Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter your backend URL: https://your-backend.railway.app
   
   vercel env add NEXT_PUBLIC_SOCKET_URL
   # Enter your backend URL: https://your-backend.railway.app
   ```

6. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard (Git Integration)

1. **Go to [vercel.com](https://vercel.com)** and sign in

2. **Click "Add New Project"**

3. **Import your Git repository**:
   - Connect your GitHub/GitLab/Bitbucket account if not already connected
   - Select your repository

4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install` (or leave default)

5. **Set Environment Variables**:
   - Click "Environment Variables"
   - Add the following:
     - `NEXT_PUBLIC_API_URL` = `https://your-backend.railway.app`
     - `NEXT_PUBLIC_SOCKET_URL` = `https://your-backend.railway.app`

6. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

## Step 4: Update CORS Settings in Backend

Make sure your backend allows requests from your Vercel domain:

```typescript
// In your backend CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app.vercel.app'
]
```

## Step 5: Verify Deployment

1. Visit your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Test the application:
   - Sign up/Login
   - Create a quiz
   - Join a quiz room
   - Test socket.io connections

## Troubleshooting

### Issue: API calls failing
- Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify your backend is accessible and CORS is configured
- Check browser console for errors

### Issue: Socket.io not connecting
- Verify `NEXT_PUBLIC_SOCKET_URL` is set correctly
- Check that your backend supports WebSocket connections
- Some hosting providers require special configuration for WebSockets

### Issue: Build fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally first

### Issue: Environment variables not working
- Remember: `NEXT_PUBLIC_*` variables are exposed to the browser
- Redeploy after adding/changing environment variables
- Check that variables are set for "Production" environment

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Continuous Deployment

Once connected to Git, Vercel will automatically deploy:
- Every push to `main` branch → Production
- Every push to other branches → Preview deployment

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.example.com` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL | `https://api.example.com` |

**Note:** Both URLs are typically the same if your backend handles both REST API and WebSocket connections.

