# Foodiesco Deployment Setup Guide

## Current Status ✅
- [x] Vercel CLI installed
- [x] Railway CLI installed  
- [x] Frontend build tested successfully
- [x] Configuration files created
- [x] Environment files prepared

## Next Steps (Manual Actions Required)

### 1. Vercel Setup
```bash
# Login to Vercel (opens browser)
vercel login

# Link your project
cd /home/andy/projects/foodiesco/foodies-frontend
vercel link

# Get project info
vercel project ls
```

Save these values for GitHub secrets:
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- VERCEL_TOKEN (from https://vercel.com/account/tokens)

### 2. Railway Setup
```bash
# Login to Railway (opens browser)
railway login

# Deploy backend
cd /home/andy/projects/foodiesco/foodies-backend
railway init
railway up
```

After deployment, note your Railway app URL (something like: https://foodiesco-backend-production-xxxx.up.railway.app)

### 3. MongoDB Atlas Setup
1. Go to https://www.mongodb.com/atlas
2. Create free cluster
3. Create database user
4. Get connection string
5. Whitelist 0.0.0.0/0 for Railway access

### 4. Update Environment Variables

#### Railway Environment Variables:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodiesco
JWT_SECRET=your_super_secure_jwt_secret_here
CLIENT_URL=https://your-vercel-app.vercel.app
```

#### Update Frontend .env.production:
Replace the Railway URL in `/home/andy/projects/foodiesco/foodies-frontend/.env.production`

### 5. GitHub Secrets Setup
Go to GitHub repo → Settings → Secrets → Actions:
- VERCEL_TOKEN: From Vercel account tokens
- VERCEL_ORG_ID: From vercel project ls
- VERCEL_PROJECT_ID: From vercel project ls

### 6. Deploy
```bash
cd /home/andy/projects/foodiesco
git add .
git commit -m "Configure production deployment settings"
git push origin main
```

## Troubleshooting
- Check GitHub Actions for build logs
- Verify environment variables are set correctly
- Test API endpoints directly
- Check browser console for CORS errors

## Commands to verify setup:
```bash
# Test Vercel CLI
vercel --version

# Test Railway CLI  
railway --version

# Test frontend build
cd foodies-frontend && npm run build

# Check git status
git status
```