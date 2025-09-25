# 🚀 Quick Start Guide - Running Foodiesco on Localhost

## 🐳 Docker Method (Recommended)

### Start the project:
```bash
docker compose up -d
```

### Stop the project:
```bash
docker compose down
```

### View logs:
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

### Restart services:
```bash
docker compose restart
```

### Rebuild after code changes:
```bash
docker compose build
docker compose up -d
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **MongoDB**: localhost:27017

## 🔧 Manual Method (Alternative)

If you prefer not to use Docker:

### 1. Start MongoDB
```bash
# Install and start MongoDB locally
sudo systemctl start mongod
```

### 2. Start Backend
```bash
cd foodies-backend
npm install
cp .env.example .env
# Edit .env with: MONGODB_URI=mongodb://localhost:27017/foodies
npm run dev
```

### 3. Start Frontend
```bash
cd foodies-frontend
npm install
npm start
```

## 🧪 Test the Setup

```bash
# Test backend health
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:3000

# Test API data
curl http://localhost:5000/api/categories
```

## 🐛 Troubleshooting

### Port conflicts:
```bash
# Check what's using ports
sudo lsof -i :3000
sudo lsof -i :5000
sudo lsof -i :27017
```

### Container issues:
```bash
# Check container status
docker compose ps

# View detailed logs
docker compose logs backend

# Restart everything
docker compose down
docker compose up -d
```

### Database issues:
```bash
# Connect to MongoDB
docker compose exec mongodb mongosh -u admin -p password

# Check database
docker compose exec mongodb mongosh foodiesco --eval "show collections"
```