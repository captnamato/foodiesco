import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Foodies 🍳
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link 
                to="/add-recipe" 
                className="text-foreground hover:text-primary transition-colors"
              >
                Add Recipe
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-foreground">
                  Welcome, {user?.name}!
                </span>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="space-x-2">
                <button className="px-4 py-2 text-sm text-foreground hover:text-primary transition-colors">
                  Sign In
                </button>
                <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;