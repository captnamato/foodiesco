import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-foodies-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">Foodies</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover and share amazing recipes from around the world. Join our
              community of food lovers and create culinary memories together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange transition-colors">
                  Recipes
                </Link>
              </li>
              <li>
                <Link to="/add-recipe" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange transition-colors">
                  Add Recipe
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/recipes?category=Dessert" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange transition-colors">
                  Desserts
                </Link>
              </li>
              <li>
                <Link to="/recipes?category=Chicken" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange transition-colors">
                  Chicken
                </Link>
              </li>
              <li>
                <Link to="/recipes?category=Beef" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange transition-colors">
                  Beef
                </Link>
              </li>
              <li>
                <Link to="/recipes?category=Pasta" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange transition-colors">
                  Pasta
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Foodies. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white visited:text-gray-300 focus:text-foodies-orange text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;