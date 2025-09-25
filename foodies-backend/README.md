# Foodies Backend API

A full-stack recipe sharing application backend built with Node.js, Express.js, and MongoDB.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management & Social Features (Follow/Unfollow)
- 🍳 Recipe CRUD Operations
- 📸 Image Upload Support
- 🏷️ Categories & Areas Management
- 🥕 Ingredients Management
- 💬 Testimonials System
- 🔍 Search & Filtering
- 📊 Pagination Support
- 🛡️ Security Best Practices
- 📝 Error Handling & Validation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer (with optional Cloudinary support)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js (>=16.0.0)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (if using local instance):
```bash
mongod
```

4. Run the development server:
```bash
npm run dev
```

5. (Optional) Seed the database:
```bash
npm run seed
```

The API will be available at `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /api/health
```

### Authentication Endpoints
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
```

### User Endpoints
```
GET    /api/users/me           # Get current user profile
GET    /api/users/:id          # Get user by ID
PUT    /api/users/avatar       # Update user avatar
GET    /api/users/:id/followers # Get user followers
GET    /api/users/:id/following # Get user following
PUT    /api/users/:id/follow    # Follow user
PUT    /api/users/:id/unfollow  # Unfollow user
```

### Recipe Endpoints
```
GET    /api/recipes           # Get all recipes (with filters)
GET    /api/recipes/popular   # Get popular recipes
GET    /api/recipes/:id       # Get single recipe
POST   /api/recipes           # Create new recipe
PUT    /api/recipes/:id       # Update recipe
DELETE /api/recipes/:id       # Delete recipe
PUT    /api/recipes/:id/favorite   # Add to favorites
DELETE /api/recipes/:id/favorite   # Remove from favorites
```

### Category Endpoints
```
GET    /api/categories        # Get all categories
GET    /api/categories/:id    # Get single category
POST   /api/categories        # Create category (admin)
PUT    /api/categories/:id    # Update category (admin)
DELETE /api/categories/:id    # Delete category (admin)
```

### Other Endpoints
- Areas: `/api/areas`
- Ingredients: `/api/ingredients`
- Testimonials: `/api/testimonials`

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodies
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

## Project Structure

```
foodies-backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── recipeController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Recipe.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── ...
│   └── utils/
│       └── jwt.js
├── uploads/
├── scripts/
│   └── seedDatabase.js
├── server.js
└── package.json
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## Security Features

- JWT authentication with secure tokens
- Password hashing with bcryptjs
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers
- Input validation and sanitization
- File upload restrictions

## License

MIT License - see LICENSE file for details