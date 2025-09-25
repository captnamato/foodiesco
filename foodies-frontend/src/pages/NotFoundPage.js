import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-foodies-orange mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              Go Back Home
            </Button>
          </Link>
          <Link to="/" className="block text-foodies-orange hover:text-foodies-orange-dark">
            Browse Recipes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;