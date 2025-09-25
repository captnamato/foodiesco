# Foodies Frontend

A modern React-based frontend for the Foodies recipe sharing platform.

## Features

- 🎨 Modern UI with Tailwind CSS and custom design system
- 🔐 JWT Authentication with Redux state management
- 📱 Responsive design with mobile-first approach
- 🍳 Recipe browsing, creation, and management
- 👥 User profiles and social features
- 🎯 TypeScript-ready with proper error handling
- ⚡ Fast and optimized with React 18
- 🛡️ Protected routes and user authentication

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: Formik + Yup validation
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Build Tool**: Create React App

## Quick Start

### Prerequisites

- Node.js (>=16.0.0)
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

3. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (Header, Footer, etc.)
│   ├── forms/           # Form components
│   ├── modals/          # Modal components
│   ├── cards/           # Card components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   └── layout/          # Layout components
├── pages/               # Route pages
├── store/               # Redux store and slices
│   └── slices/          # Redux slices
├── services/            # API service functions
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── assets/              # Static assets
│   ├── images/          # Images
│   └── icons/           # Icons
├── App.js               # Main app component
└── index.js             # App entry point
```

## Design System

The app uses a custom design system based on the Foodies brand:

- **Primary Color**: Foodies Orange (#FF6B2C)
- **Typography**: Inter font family
- **Components**: Custom variants with CVA (Class Variance Authority)
- **Spacing**: Consistent spacing scale
- **Shadows**: Soft, float, and modal shadow variants

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Foodies
REACT_APP_VERSION=1.0.0
```

## API Integration

The frontend integrates with the Foodies backend API:

- Authentication endpoints
- Recipe CRUD operations
- User management
- File uploads for images
- Social features (follow/unfollow)

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for new components when possible
3. Follow the design system guidelines
4. Add proper error handling and loading states
5. Write tests for new components

## License

MIT License - see LICENSE file for details