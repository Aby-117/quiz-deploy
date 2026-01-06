# Fix: "No Next.js version detected" Error

## Problem
Vercel can't find Next.js because it's looking in the wrong directory.

## Solution

### Option 1: Set Root Directory in Vercel Dashboard (Easiest)

1. Go to your project in Vercel Dashboard
2. Go to **Settings** → **General**
3. Scroll to **Root Directory**
4. Set it to: `frontend`
5. Click **Save**
6. Redeploy your project

### Option 2: Deploy from Root with vercel.json

The `vercel.json` file in the root directory now points to the frontend folder. 

**If deploying via CLI:**
```bash
# Make sure you're in the ROOT directory (quiz-deploy), NOT frontend
vercel
```

**If deploying via Dashboard:**
1. Import your repository
2. Set **Root Directory** to: `frontend`
3. Vercel will use the vercel.json configuration

### Option 3: Move vercel.json to Frontend (Alternative)

If the above doesn't work:

1. Delete `vercel.json` from root
2. Keep `vercel.json` in `frontend/` folder
3. In Vercel Dashboard, set **Root Directory** to: `frontend`

## Verification

After setting Root Directory:
- ✅ Vercel should detect Next.js framework
- ✅ Build should start automatically
- ✅ Check build logs to confirm it's running `npm install` and `npm run build` in the frontend directory

## Common Mistakes

❌ **Wrong**: Root Directory = `.` (root of repo)  
✅ **Correct**: Root Directory = `frontend`

❌ **Wrong**: Running `vercel` from inside `frontend/` folder  
✅ **Correct**: Running `vercel` from root directory, with Root Directory set to `frontend`

## Still Having Issues?

1. Check that `frontend/package.json` contains `"next"` in dependencies
2. Verify Root Directory setting in Vercel Dashboard
3. Check build logs for exact error messages
4. Try deleting and re-importing the project

