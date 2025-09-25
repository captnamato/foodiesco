# 🐳 Docker Setup for Foodiesco

Complete Docker configuration for the Foodiesco recipe sharing platform.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### 1. Start the Development Environment
```bash
# Start all services (MongoDB, Backend, Frontend)
docker compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 2. Access the Application
- **Frontend (Development)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Production Frontend**: http://localhost:8080 (when using production profile)

## 📦 Services

### MongoDB Database
- **Container**: `foodiesco-mongodb`
- **Port**: 27017
- **Database**: `foodiesco`
- **User**: `foodiesco` / `foodiesco123`
- **Admin**: `admin` / `password`

### Backend API
- **Container**: `foodiesco-backend`
- **Port**: 5000
- **Hot Reload**: ✅ Enabled
- **Environment**: Development

### Frontend React App
- **Container**: `foodiesco-frontend`
- **Port**: 3000
- **Hot Reload**: ✅ Enabled
- **Environment**: Development

## 🛠️ Development Commands

### Start/Stop Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d mongodb
docker-compose up -d backend
docker-compose up -d frontend

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This deletes all data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Force rebuild without cache
docker-compose build --no-cache
```

### Execute Commands in Containers
```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password
```

## 🏗️ Production Build

### Build Production Frontend
```bash
# Start with production profile
docker-compose --profile production up frontend-prod -d

# Access production build at http://localhost:8080
```

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Environment Variables
The backend environment is automatically configured via docker-compose.
To customize settings, edit the environment variables in `docker-compose.yml`.

### Database Initialization
MongoDB is automatically initialized with:
- Sample categories, areas, and ingredients
- Application user: `foodiesco`
- Admin user: `admin`

## 📊 Health Checks

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### Frontend Health Check
```bash
curl http://localhost:3000
```

### Database Health Check
```bash
docker-compose exec mongodb mongosh -u admin -p password --eval "db.adminCommand('ping')"
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :5000
sudo lsof -i :27017

# Kill the process or change ports in docker-compose.yml
```

#### Database Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Verify database initialization
docker-compose exec mongodb mongosh -u admin -p password foodiesco --eval "show collections"
```

#### Frontend/Backend Connection Issues
```bash
# Check if backend is responding
curl http://localhost:5000/api/health

# Check backend logs
docker-compose logs backend

# Verify CORS configuration
docker-compose exec backend cat /app/.env
```

#### Rebuild Everything
```bash
# Stop everything
docker-compose down -v

# Remove all images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## 🔍 Monitoring

### Container Status
```bash
docker-compose ps
```

### Resource Usage
```bash
docker stats
```

### Network Information
```bash
docker network ls
docker network inspect foodiesco_foodiesco-network
```

## 📝 Development Workflow

1. **Start Development Environment**
   ```bash
   docker-compose up -d
   ```

2. **Make Code Changes**
   - Backend changes auto-reload via nodemon
   - Frontend changes auto-reload via React dev server

3. **Test Changes**
   - Backend: http://localhost:5000/api/health
   - Frontend: http://localhost:3000

4. **View Logs**
   ```bash
   docker-compose logs -f
   ```

5. **Stop When Done**
   ```bash
   docker-compose down
   ```

## 🚀 Deployment Ready

This Docker setup includes:
- ✅ Production-ready images with multi-stage builds
- ✅ Health checks and monitoring
- ✅ Volume persistence for database data
- ✅ Network isolation between services
- ✅ Environment configuration via compose
- ✅ Hot reload for development workflow
- ✅ Automatic database initialization with sample data
- ✅ Security best practices and .dockerignore files
- ✅ Complete local development environment
