# 🍳 Foodies - Recipe Sharing Platform

A full-stack recipe sharing application built with React.js and Node.js, featuring user authentication, social interactions, and a modern UI.

## ✨ Features

### 🔐 Authentication & User Management
- JWT-based authentication system
- User registration and login
- User profiles with avatars
- Social features (follow/unfollow users)
- Private user dashboards

### 🍽️ Recipe Management
- Create, read, update, delete recipes
- Image upload support
- Recipe categorization
- Ingredient management
- Cooking time and difficulty levels
- Recipe search and filtering

### 🌟 Social Features
- Follow/unfollow other users
- Favorite recipes
- User testimonials
- Recipe popularity tracking
- User activity feeds

### 🎨 Modern UI/UX
- Responsive design for all devices
- Modern React components
- Tailwind CSS styling
- Loading states and error handling
- Modal dialogs and forms

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate limiting** - API protection
- **Input validation** - Data sanitization
- **Image optimization** - File handling

## 🚀 Quick Start

### Prerequisites
- Node.js (>=16.0.0)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/foodiesco.git
   cd foodiesco
   ```

2. **Setup Backend**
   ```bash
   cd foodies-backend
   npm install

   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration

   # Seed the database (optional)
   npm run seed

   # Start the server
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../foodies-frontend
   npm install

   # Create .env file if needed
   cp .env.example .env

   # Start the development server
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📁 Project Structure

```
foodiesco/
├── foodies-backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   ├── scripts/            # Database seeding scripts
│   ├── uploads/            # User uploaded files
│   └── server.js           # Application entry point
├── foodies-frontend/        # React.js frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store and slices
│   │   ├── styles/         # CSS and styling
│   │   └── utils/          # Utility functions
│   └── package.json
├── projectdocs/            # Project documentation
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodies
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Endpoints
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/follow` - Follow user
- `PUT /api/users/:id/unfollow` - Unfollow user

### Recipe Endpoints
- `GET /api/recipes` - Get recipes (with filters)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `PUT /api/recipes/:id/favorite` - Toggle favorite

### Other Endpoints
- `GET /api/categories` - Get categories
- `GET /api/areas` - Get areas
- `GET /api/ingredients` - Get ingredients
- `GET /api/testimonials` - Get testimonials

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd foodies-frontend && npm run build`
3. Set output directory: `foodies-frontend/build`
4. Add environment variables in Vercel dashboard

### Railway/Heroku (Backend)
1. Create new app on Railway/Heroku
2. Connect GitHub repository
3. Set build command: `cd foodies-backend && npm install`
4. Set start command: `cd foodies-backend && npm start`
5. Add environment variables

### MongoDB Atlas
1. Create MongoDB Atlas cluster
2. Update MONGODB_URI in environment variables
3. Whitelist deployment IP addresses

## 🧪 Testing

```bash
# Backend tests
cd foodies-backend
npm test

# Frontend tests
cd foodies-frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Development Team

- **Frontend**: React.js, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, bcryptjs
- **Deployment**: Vercel, Railway/Heroku

## 📧 Support

For support, email support@foodies.com or join our Slack channel.

---

**Happy Cooking! 🍳✨**