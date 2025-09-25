# 🚀 Foodiesco Deployment Credentials & Setup

## ✅ Completed Setup Steps

### 1. Vercel Frontend Deployment
- **Status**: ✅ Configured and Linked
- **Project URL**: https://foodiesco.vercel.app
- **Organization ID**: `team_D1vM0SJB3nquBDSSeyffhzUZ`
- **Project ID**: `prj_HHz2IbcQE02RoACUZkziELAKcuDD`

### 2. Railway Backend Deployment
- **Status**: ✅ Deployed
- **Backend URL**: https://foodiesco-production.up.railway.app
- **Project ID**: `5344838d-7d09-4e03-9943-ff3888f12cf5`

### 3. Environment Variables Configured
- **Frontend**: ✅ Updated with Railway API URL
- **Backend**: ✅ Set with production values (except MongoDB)

## 🔐 GitHub Secrets Setup Required

Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

```
VERCEL_TOKEN=        [Get from https://vercel.com/account/tokens]
VERCEL_ORG_ID=team_D1vM0SJB3nquBDSSeyffhzUZ
VERCEL_PROJECT_ID=prj_HHz2IbcQE02RoACUZkziELAKcuDD
```

### How to get VERCEL_TOKEN:
1. Go to https://vercel.com/account/tokens
2. Create new token with "Full Access" scope
3. Copy the token value

## 🗄️ MongoDB Atlas Setup (Required)

### Current Status: ⚠️  PLACEHOLDER CONNECTION
The backend is currently using a placeholder MongoDB URI. You need to:

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/atlas
2. **Create Free Cluster** (M0 Sandbox)
3. **Create Database User** with read/write permissions
4. **Get Connection String** (should look like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/foodiesco?retryWrites=true&w=majority
   ```
5. **Update Railway Environment Variables**:
   ```bash
   cd /home/andy/projects/foodiesco/foodies-backend
   railway variables --set "MONGODB_URI=your_actual_mongodb_connection_string"
   ```

## 📁 Current File Structure
```
/home/andy/projects/foodiesco/
├── .github/workflows/deploy.yml     ✅ GitHub Actions workflow
├── vercel.json                      ✅ Vercel config (root)
├── .vercelignore                    ✅ Vercel ignore file
├── foodies-frontend/
│   ├── vercel.json                  ✅ Frontend Vercel config
│   ├── .env.production              ✅ Production environment
│   ├── .env.development             ✅ Development environment
│   └── .vercel/                     ✅ Vercel project linked
└── foodies-backend/
    ├── .env.production              ✅ Backend environment template
    └── .railway/                    ✅ Railway project linked
```

## 🚀 Deploy Commands

### Deploy Frontend (GitHub Actions):
```bash
cd /home/andy/projects/foodiesco
git add .
git commit -m "Update deployment configuration"
git push origin main
```

### Deploy Backend (Railway):
```bash
cd /home/andy/projects/foodiesco/foodies-backend
railway up
```

## 🔍 Verification Commands

### Test Frontend Build:
```bash
cd /home/andy/projects/foodiesco/foodies-frontend
npm run build
```

### Check Railway Status:
```bash
cd /home/andy/projects/foodiesco/foodies-backend
railway status
railway logs
```

### Check Vercel Status:
```bash
cd /home/andy/projects/foodiesco/foodies-frontend
vercel ls
```

## 🐛 Troubleshooting

### Common Issues:
1. **MongoDB Connection Error**: Update MONGODB_URI in Railway
2. **CORS Issues**: Verify CLIENT_URL matches Vercel domain
3. **Build Failures**: Check GitHub Actions logs
4. **404 on React Routes**: Ensured by vercel.json rewrites

### Check Status:
- **GitHub Actions**: https://github.com/your-repo/actions
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.com/dashboard
- **Frontend**: https://foodiesco.vercel.app
- **Backend**: https://foodiesco-production.up.railway.app/api/health

## 📋 Next Steps
1. ✅ Set up GitHub secrets
2. ⚠️  Configure MongoDB Atlas
3. ✅ Push changes to trigger deployment
4. ✅ Test both frontend and backend