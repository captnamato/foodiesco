# MongoDB Atlas Setup Guide for Foodiesco

## Step-by-Step MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" or "Sign Up"
3. Create account with your email
4. Choose "Shared Clusters" (Free M0)

### 2. Create Your First Cluster
1. After login, click "Create a New Cluster"
2. Choose "FREE" tier (M0 Sandbox)
3. Select cloud provider: **AWS** (recommended)
4. Select region: **Any US region** (closest to Railway servers)
5. Cluster name: `foodiesco-cluster`
6. Click "Create Cluster" (takes 1-3 minutes)

### 3. Create Database User
1. In left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `foodiesco-user`
5. Password: Generate a secure password (save this!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### 4. Configure Network Access
1. In left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Railway to connect
4. Click "Confirm"

### 5. Get Connection String
1. Go to "Clusters" (main dashboard)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **4.1 or later**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://foodiesco-user:<password>@foodiesco-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Prepare Final Connection String
Replace `<password>` with your actual password:
```
mongodb+srv://foodiesco-user:YOUR_ACTUAL_PASSWORD@foodiesco-cluster.xxxxx.mongodb.net/foodiesco?retryWrites=true&w=majority
```

Note: Added `/foodiesco` as database name before the `?`

## Quick Commands After Setup

Once you have your connection string, run:

```bash
cd /home/andy/projects/foodiesco/foodies-backend
railway variables --set "MONGODB_URI=your_actual_connection_string_here"
railway up
```

## Example Connection String Format:
```
mongodb+srv://foodiesco-user:MySecurePass123@foodiesco-cluster.abc12.mongodb.net/foodiesco?retryWrites=true&w=majority
```

## Troubleshooting:
- If connection fails: Check password has no special characters that need encoding
- If still failing: Try whitelisting specific Railway IPs
- Connection timeout: Ensure "Allow Access from Anywhere" is set