import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../ui/Button';
import AuthModal from '../modals/AuthModal';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddRecipe = () => {
    if (isAuthenticated) {
      navigate('/add-recipe');
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="bg-gradient-to-br from-foodies-orange to-foodies-orange-dark text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover & Share
            <br />
            <span className="text-yellow-200">Amazing Recipes</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-orange-100 leading-relaxed">
            Join our community of food lovers. Share your favorite recipes,
            discover new flavors, and connect with fellow cooking enthusiasts.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for recipes, ingredients, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 text-gray-800 bg-white rounded-full shadow-lg focus:ring-4 focus:ring-yellow-200 focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foodies-orange hover:text-foodies-orange-dark transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={handleAddRecipe}
              size="lg"
              className="bg-white text-foodies-orange hover:bg-gray-50 font-semibold px-8 py-3"
            >
              Share Your Recipe
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-foodies-orange font-semibold px-8 py-3"
              onClick={() => document.getElementById('recipes-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Recipes
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-200 mb-2">1000+</div>
              <div className="text-orange-100">Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-200 mb-2">500+</div>
              <div className="text-orange-100">Cooks</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-3xl md:text-4xl font-bold text-yellow-200 mb-2">50+</div>
              <div className="text-orange-100">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white bg-opacity-5 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white bg-opacity-5 rounded-full"></div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </section>
  );
};

export default HeroSection;